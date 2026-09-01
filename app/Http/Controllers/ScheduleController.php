<?php

namespace App\Http\Controllers;

use App\Models\EventSetting;
use App\Models\Paper;
use App\Models\Room;
use App\Models\Schedule;
use App\Services\AiSchedulingService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        $settings = EventSetting::first() ?? EventSetting::create([
            'event_days' => 2,
            'start_time' => '13:00',
            'end_time' => '17:00',
            'break_duration_minutes' => 0,
            'presentation_duration_minutes' => 60,
        ]);

        return Inertia::render('Schedule', [
            'scheduleParams' => $settings,
            'rooms' => Room::all(),
            // Fetch real schedules from DB, not from session
            'allocations' => Schedule::with(['paper.author', 'room'])->get()->map(function($schedule) {
                return [
                    'id' => $schedule->paper_id,
                    'paper' => $schedule->paper->title,
                    'author' => $schedule->paper->author?->name ?? 'Unknown Author',
                    'room' => $schedule->room->name,
                    'time' => Carbon::parse($schedule->scheduled_date)->format('d M') . ' ' . Carbon::parse($schedule->start_time)->format('H:i'),
                    'method' => $schedule->method,
                    'type' => 'Oral',
                    'is_locked' => $schedule->is_locked
                ];
            })->toArray()
        ]);
    }

    public function updateScheduleParams(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_days' => 'required|integer|min:1',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'presenter_duration' => 'required|integer|min:1',
        ]);

        $setting = EventSetting::first();
        $setting->event_days = (int) $validated['event_days'];
        $setting->start_time = $validated['start_time'] . ':00';
        $setting->end_time = $validated['end_time'] . ':00';
        $setting->presentation_duration_minutes = (int) $validated['presenter_duration'];
        $setting->save();

        return back()->with('success', 'Parameter penjadwalan berhasil diupdate');
    }

    public function autoSchedule(Request $request, AiSchedulingService $aiService)
    {
        // 1. Fetch Real Configuration
        $config = EventSetting::first();
        if (!$config) {
            return back()->with('error', 'Konfigurasi event belum diatur.');
        }

        // Hitung total durasi harian dalam menit
        $startTime = Carbon::parse($config->start_time);
        $endTime = Carbon::parse($config->end_time);
        $dailyDuration = abs($startTime->diffInMinutes($endTime));

        // 2. Fetch Real Data
        $rooms = Room::all();
        // Hanya jadwalkan paper yang statusnya accepted atau under_review (sementara agar ada data)
        // Dan diasumsikan semua oral (karena tidak ada kolom type di db saat ini)
        $papers = Paper::whereIn('status', ['accepted', 'under_review'])->get();

        if ($rooms->isEmpty() || $papers->isEmpty()) {
            return back()->with('error', 'Ruangan atau paper tidak tersedia.');
        }

        // 3. AI Clustering (Pengelompokan Topik)
        $topicMapping = $aiService->clusterPapersToRooms($papers, $rooms);

        // 4. Greedy Algorithm
        $roomUsage = []; // $roomUsage[room_id][day] = used_minutes
        $authorSchedules = []; // $authorSchedules[author_id][day][start_time] = true
        
        $newSchedules = [];
        $todayDate = Carbon::today();

        // Kosongkan jadwal lama yang belum di-lock
        Schedule::where('is_locked', false)->delete();

        foreach ($papers as $paper) {
            $roomId = $topicMapping[$paper->id] ?? $rooms->first()->id;
            $authorId = $paper->user_id;
            $assigned = false;

            for ($day = 1; $day <= $config->event_days; $day++) {
                if ($assigned) break;

                if (!isset($roomUsage[$roomId][$day])) {
                    $roomUsage[$roomId][$day] = 0;
                }

                while (($roomUsage[$roomId][$day] + $config->presentation_duration_minutes) <= $dailyDuration) {
                    $usedMinutes = $roomUsage[$roomId][$day];
                    
                    // Hitung jam mulai
                    $presentationStart = Carbon::parse($config->start_time)->addMinutes($usedMinutes);
                    $presentationEnd = $presentationStart->copy()->addMinutes($config->presentation_duration_minutes);
                    $timeKey = $presentationStart->format('H:i');
                    $scheduleDate = $todayDate->copy()->addDays($day - 1);

                    // Cek double booking
                    if (!isset($authorSchedules[$authorId][$day][$timeKey])) {
                        // Alokasikan dan simpan ke Database
                        Schedule::create([
                            'paper_id' => $paper->id,
                            'room_id' => $roomId,
                            'scheduled_date' => $scheduleDate,
                            'start_time' => $scheduleDate->format('Y-m-d') . ' ' . $presentationStart->format('H:i:s'),
                            'end_time' => $scheduleDate->format('Y-m-d') . ' ' . $presentationEnd->format('H:i:s'),
                            'method' => 'Auto-Scheduled AI',
                            'is_locked' => false,
                        ]);

                        $roomUsage[$roomId][$day] += $config->presentation_duration_minutes;
                        $authorSchedules[$authorId][$day][$timeKey] = true;
                        $assigned = true;
                        break; 
                    } else {
                        // Jika bentrok, lewatkan slot ini
                        $roomUsage[$roomId][$day] += $config->presentation_duration_minutes;
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'AI Auto-Scheduling berhasil memetakan naskah ke ruangan & jam!');
    }

    public function publishSchedule(Request $request): RedirectResponse
    {
        Schedule::query()->update(['is_locked' => true]);
        Paper::whereIn('id', Schedule::pluck('paper_id'))->update(['status' => 'Published']);

        return back()->with('success', 'Jadwal final berhasil dipublikasikan');
    }
}

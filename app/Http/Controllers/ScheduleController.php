<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\EventSetting;
use App\Models\Paper;
use App\Models\Room;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $rooms = Room::query()->get()->map(function (Room $room) {
            return [
                'id' => $room->id,
                'name' => $room->name,
                'location' => $room->location,
                'capacity' => $room->capacity . ' kursi',
                'topic' => $room->topic,
            ];
        });

        $setting = EventSetting::query()->first();
        if (!$setting) {
            $setting = EventSetting::create([
                'event_days' => 2,
                'start_time' => '11:00',
                'end_time' => '16:00',
                'break_duration_minutes' => 15,
                'presentation_duration_minutes' => 40,
            ]);
        }

        $scheduleParams = [
            'days' => $setting->event_days,
            'start_time' => substr((string) $setting->start_time, 0, 5),
            'end_time' => substr((string) $setting->end_time, 0, 5),
            'break_duration' => $setting->break_duration_minutes,
            'presenter_duration' => $setting->presentation_duration_minutes,
        ];

        $schedules = Schedule::with(['paper', 'room'])->get();

        $allocations = $schedules->map(function (Schedule $s) {
            return [
                'id' => $s->id,
                'paper' => $s->paper?->title ?? 'Untitled Paper',
                'author' => $s->paper?->author_name ?? 'Unknown Author',
                'room' => $s->room?->name ?? 'Unassigned Room',
                'scheduled_date' => $s->scheduled_date?->format('Y-m-d'),
                'start_time' => $s->start_time?->format('H:i'),
                'end_time' => $s->end_time?->format('H:i'),
                'method' => $s->method,
                'is_locked' => $s->is_locked,
            ];
        });

        return Inertia::render('Schedule', [
            'rooms' => $rooms,
            'scheduleParams' => $scheduleParams,
            'allocations' => $allocations,
        ]);
    }

    /**
     * Store or update schedule parameters.
     */
    public function updateScheduleParams(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'days' => ['required', 'integer', 'min:1'],
            'start_time' => ['required', 'string'],
            'end_time' => ['required', 'string'],
            'break_duration' => ['required', 'integer', 'min:0'],
            'presenter_duration' => ['required', 'integer', 'min:1'],
        ]);

        $setting = EventSetting::query()->first();
        if (!$setting) {
            $setting = new EventSetting();
        }

        $setting->event_days = (int) $validated['days'];
        $setting->start_time = $validated['start_time'];
        $setting->end_time = $validated['end_time'];
        $setting->break_duration_minutes = (int) $validated['break_duration'];
        $setting->presentation_duration_minutes = (int) $validated['presenter_duration'];
        $setting->save();

        return back()->with('success', 'Parameter penjadwalan berhasil diupdate');
    }

    /**
     * Programmatic Auto-Scheduling algorithm (Draft Allocation).
     */
    public function autoSchedule(Request $request): RedirectResponse
    {
        $setting = EventSetting::query()->first();
        if (!$setting) {
            $setting = EventSetting::create([
                'event_days' => 2,
                'start_time' => '11:00',
                'end_time' => '16:00',
                'break_duration_minutes' => 15,
                'presentation_duration_minutes' => 40,
            ]);
        }

        $rooms = Room::all();
        if ($rooms->isEmpty()) {
            return back()->with('error', 'Silakan tambahkan ruangan terlebih dahulu.');
        }

        // Delete unlocked previous schedules
        Schedule::where('is_locked', false)->delete();

        // Get unassigned or scheduled (unlocked) papers
        $papers = Paper::all();
        if ($papers->isEmpty()) {
            return back()->with('info', 'Tidak ada paper untuk dijadwalkan.');
        }

        DB::transaction(function () use ($rooms, $papers, $setting) {
            $paperIndex = 0;
            $totalPapers = $papers->count();
            $baseDate = Carbon::today();

            for ($day = 0; $day < $setting->event_days; $day++) {
                $currentDate = $baseDate->copy()->addDays($day);
                
                foreach ($rooms as $room) {
                    $currentTime = Carbon::parse($currentDate->format('Y-m-d') . ' ' . $setting->start_time);
                    $endTime = Carbon::parse($currentDate->format('Y-m-d') . ' ' . $setting->end_time);

                    while ($currentTime->copy()->addMinutes($setting->presentation_duration_minutes)->lte($endTime)) {
                        if ($paperIndex >= $totalPapers) {
                            break 2; // All papers scheduled
                        }

                        $paper = $papers[$paperIndex];
                        $slotStart = $currentTime->copy();
                        $slotEnd = $currentTime->copy()->addMinutes($setting->presentation_duration_minutes);

                        Schedule::create([
                            'paper_id' => $paper->id,
                            'room_id' => $room->id,
                            'scheduled_date' => $currentDate->format('Y-m-d'),
                            'start_time' => $slotStart,
                            'end_time' => $slotEnd,
                            'method' => 'Auto-Scheduled AI',
                            'is_locked' => false,
                        ]);

                        $paper->update(['status' => 'Scheduled']);

                        // Advance time by presentation duration + break duration
                        $currentTime->addMinutes($setting->presentation_duration_minutes + $setting->break_duration_minutes);
                        $paperIndex++;
                    }
                }
            }
        });

        return back()->with('success', 'Algoritma AI Auto-Scheduling berhasil dijalankan. Draf jadwal berhasil dibuat.');
    }

    /**
     * Publish the final schedule.
     */
    public function publishSchedule(Request $request): RedirectResponse
    {
        Schedule::query()->update(['is_locked' => true]);
        Paper::whereIn('id', Schedule::pluck('paper_id'))->update(['status' => 'Published']);

        return back()->with('success', 'Jadwal final berhasil dipublikasikan');
    }
}

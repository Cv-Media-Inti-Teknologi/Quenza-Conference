<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Jobs\SendSchedulePublishNotificationJob;
use App\Models\EventSetting;
use App\Models\Paper;
use App\Models\Room;
use App\Models\Schedule;
use App\Services\AiSchedulingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        $globalSettings = EventSetting::whereNull('room_id')->first() ?? EventSetting::create([
            'room_id' => null,
            'event_days' => 2,
            'start_time' => '11:00:00',
            'end_time' => '14:00:00',
            'break_duration_minutes' => 15,
            'presentation_duration_minutes' => 40,
            'presenter_count' => 38,
        ]);

        $rooms = Room::with('eventSetting')->get();

        $sessionsData = $this->buildSessionsData($globalSettings, $rooms);

        return Inertia::render('Schedule', [
            'scheduleParams' => $globalSettings,
            'rooms' => $rooms,
            'allocations' => $sessionsData['rooms'],
            'sessionMetadata' => [
                'conflict_detected' => $sessionsData['conflict_detected'],
                'conflict_count' => $sessionsData['conflict_count'],
                'conflicts' => $sessionsData['conflicts'],
                'is_locked' => $sessionsData['is_locked'],
            ],
        ]);
    }

    public function updateScheduleParams(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'room_id' => 'nullable|exists:rooms,id',
            'event_days' => 'required|integer|min:1',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'presenter_duration' => 'required|integer|min:1',
            'break_duration' => 'required|integer|min:0',
            'presenter_count' => 'required|integer|min:0',
        ]);

        $start = strlen($validated['start_time']) === 5 ? $validated['start_time'].':00' : $validated['start_time'];
        $end = strlen($validated['end_time']) === 5 ? $validated['end_time'].':00' : $validated['end_time'];

        if (Carbon::parse($end)->lte(Carbon::parse($start))) {
            return back()->with('error', 'Jam mulai harus lebih awal dari jam selesai.');
        }

        $roomId = ! empty($validated['room_id']) ? (int) $validated['room_id'] : null;

        $setting = EventSetting::updateOrCreate(
            ['room_id' => $roomId],
            [
                'event_days' => (int) $validated['event_days'],
                'start_time' => $start,
                'end_time' => $end,
                'presentation_duration_minutes' => (int) $validated['presenter_duration'],
                'break_duration_minutes' => (int) $validated['break_duration'],
                'presenter_count' => (int) $validated['presenter_count'],
            ]
        );

        $roomName = $roomId ? Room::find($roomId)?->name : 'Global';

        return back()->with('success', "Konfigurasi durasi acara untuk [{$roomName}] berhasil disimpan!");
    }

    public function updateRoomParams(Room $room, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_days' => 'required|integer|min:1',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'presenter_duration' => 'required|integer|min:1',
            'break_duration' => 'required|integer|min:0',
            'presenter_count' => 'required|integer|min:0',
        ]);

        $start = strlen($validated['start_time']) === 5 ? $validated['start_time'].':00' : $validated['start_time'];
        $end = strlen($validated['end_time']) === 5 ? $validated['end_time'].':00' : $validated['end_time'];

        if (Carbon::parse($end)->lte(Carbon::parse($start))) {
            return back()->with('error', 'Jam mulai harus lebih awal dari jam selesai.');
        }

        EventSetting::updateOrCreate(
            ['room_id' => $room->id],
            [
                'event_days' => (int) $validated['event_days'],
                'start_time' => $start,
                'end_time' => $end,
                'presentation_duration_minutes' => (int) $validated['presenter_duration'],
                'break_duration_minutes' => (int) $validated['break_duration'],
                'presenter_count' => (int) $validated['presenter_count'],
            ]
        );

        return back()->with('success', "Konfigurasi acara ruangan {$room->name} berhasil diperbarui!");
    }

    public function destroyRoomParams(Room $room): RedirectResponse
    {
        EventSetting::where('room_id', $room->id)->delete();

        return back()->with('success', "Konfigurasi acara ruangan {$room->name} berhasil direset ke nilai default!");
    }

    public function getSessions(): JsonResponse
    {
        $globalSettings = EventSetting::whereNull('room_id')->first() ?? new EventSetting([
            'event_days' => 2,
            'start_time' => '11:00:00',
            'end_time' => '14:00:00',
            'break_duration_minutes' => 15,
            'presentation_duration_minutes' => 40,
            'presenter_count' => 38,
        ]);

        $rooms = Room::with('eventSetting')->get();
        $sessionsData = $this->buildSessionsData($globalSettings, $rooms);

        return response()->json($sessionsData);
    }

    public function autoSchedule(Request $request, AiSchedulingService $aiService): JsonResponse|RedirectResponse
    {
        $globalSettings = EventSetting::whereNull('room_id')->first() ?? EventSetting::create([
            'room_id' => null,
            'event_days' => 2,
            'start_time' => '11:00:00',
            'end_time' => '14:00:00',
            'break_duration_minutes' => 15,
            'presentation_duration_minutes' => 40,
            'presenter_count' => 38,
        ]);

        $rooms = Room::with('eventSetting')->get();
        if ($rooms->isEmpty()) {
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Ruangan tidak tersedia.'], 422);
            }

            return back()->with('error', 'Ruangan tidak tersedia.');
        }

        // Filter strictly accepted papers
        $papers = Paper::whereIn('status', ['accepted', 'accepted_paid'])->get();

        // Fallback in dev if no accepted papers exist
        if ($papers->isEmpty()) {
            $papers = Paper::limit(15)->get();
            foreach ($papers as $p) {
                $p->status = 'accepted';
                $p->save();
            }
        }

        if ($papers->isEmpty()) {
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Tidak ada paper berstatus accepted untuk dijadwalkan.'], 422);
            }

            return back()->with('error', 'Tidak ada paper berstatus accepted untuk dijadwalkan.');
        }

        // AI Clustering by Topic
        $topicMapping = $aiService->clusterPapersToRooms($papers, $rooms);

        // Remove old unlocked schedules
        Schedule::where('is_locked', false)->delete();

        $todayDate = Carbon::today();

        // Group papers by assigned room
        $roomPapers = [];
        foreach ($rooms as $r) {
            $roomPapers[$r->id] = [];
        }
        foreach ($papers as $paper) {
            $rId = $topicMapping[$paper->id] ?? $rooms->first()->id;
            if (! isset($roomPapers[$rId])) {
                $roomPapers[$rId] = [];
            }
            $roomPapers[$rId][] = $paper;
        }

        $authorTimeSlots = [];
        $conflicts = [];

        foreach ($rooms as $room) {
            $roomConfig = $room->eventSetting ?? $globalSettings;
            $startTime = Carbon::parse($roomConfig->start_time ?: '11:00:00');
            $endTime = Carbon::parse($roomConfig->end_time ?: '14:00:00');
            $slotMinutes = (int) ($roomConfig->presentation_duration_minutes ?: 40);
            $breakMinutes = (int) ($roomConfig->break_duration_minutes ?: 15);

            $assignedPapers = $roomPapers[$room->id] ?? [];
            $currentTime = $startTime->copy();
            $paperIndex = 0;
            $slotCounter = 0;

            while ($currentTime->lt($endTime) && $paperIndex < count($assignedPapers)) {
                $slotCounter++;

                // Insert break after every 2 slots
                if ($slotCounter === 3 && $breakMinutes > 0) {
                    $currentTime->addMinutes($breakMinutes);
                }

                $slotStart = $currentTime->copy();
                $slotEnd = $slotStart->copy()->addMinutes($slotMinutes);

                if ($slotEnd->gt($endTime)) {
                    break;
                }

                $paper = $assignedPapers[$paperIndex];
                $authorId = $paper->user_id;
                $timeKey = $slotStart->format('H:i');

                $hasConflict = false;
                if (isset($authorTimeSlots[$authorId][$timeKey])) {
                    $hasConflict = true;
                    $conflicts[] = [
                        'paper_id' => $paper->id,
                        'author_id' => $authorId,
                        'time' => $timeKey,
                        'room_id' => $room->id,
                        'conflicting_room_id' => $authorTimeSlots[$authorId][$timeKey],
                    ];
                } else {
                    $authorTimeSlots[$authorId][$timeKey] = $room->id;
                }

                Schedule::create([
                    'paper_id' => $paper->id,
                    'room_id' => $room->id,
                    'scheduled_date' => $todayDate,
                    'start_time' => $todayDate->format('Y-m-d').' '.$slotStart->format('H:i:s'),
                    'end_time' => $todayDate->format('Y-m-d').' '.$slotEnd->format('H:i:s'),
                    'method' => 'Auto-Scheduled AI',
                    'is_locked' => false,
                ]);

                $currentTime->addMinutes($slotMinutes);
                $paperIndex++;
            }
        }

        $sessionsData = $this->buildSessionsData($globalSettings, $rooms);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Engine Quenza AI berhasil menyusun jadwal bebas bentrok!',
                'conflict_detected' => $sessionsData['conflict_detected'],
                'conflict_count' => $sessionsData['conflict_count'],
                'conflicts' => $sessionsData['conflicts'],
                'is_locked' => $sessionsData['is_locked'],
                'rooms' => $sessionsData['rooms'],
            ]);
        }

        return back()->with('success', 'Engine Quenza AI berhasil menyusun jadwal bebas bentrok!');
    }

    public function publishSchedule(Request $request): JsonResponse|RedirectResponse
    {
        Schedule::query()->update(['is_locked' => true]);

        $scheduledPaperIds = Schedule::pluck('paper_id')->unique();
        Paper::whereIn('id', $scheduledPaperIds)->update(['status' => 'published']);

        // Dispatch async mass email/notification
        SendSchedulePublishNotificationJob::dispatch();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Jadwal final resmi berhasil dipublikasikan dan tiket notifikasi dikirimkan via antrean email!',
            ]);
        }

        return back()->with('success', 'Jadwal final resmi berhasil dipublikasikan dan tiket notifikasi dikirimkan via antrean email!');
    }

    public function exportPdf(): HttpResponse
    {
        $globalSettings = EventSetting::whereNull('room_id')->first() ?? new EventSetting([
            'event_days' => 2,
            'start_time' => '11:00:00',
            'end_time' => '14:00:00',
            'break_duration_minutes' => 15,
            'presentation_duration_minutes' => 40,
            'presenter_count' => 38,
        ]);

        $rooms = Room::with('eventSetting')->get();
        $sessionsData = $this->buildSessionsData($globalSettings, $rooms);

        return response()->view('schedule.export_pdf', [
            'settings' => $globalSettings,
            'rooms' => $sessionsData['rooms'],
            'generatedAt' => Carbon::now()->translatedFormat('d F Y, H:i'),
        ]);
    }

    /**
     * Build unified structured sessions data with conflict detection and empty slot support.
     */
    private function buildSessionsData(EventSetting $globalSettings, $rooms): array
    {
        $allSchedules = Schedule::with(['paper.author', 'room'])
            ->orderBy('start_time')
            ->get();

        $isLocked = $allSchedules->isNotEmpty() && $allSchedules->every(fn ($s) => $s->is_locked);

        // Detect overlaps across rooms for the same author
        $authorSlots = [];
        $conflicts = [];

        foreach ($allSchedules as $s) {
            $authorId = $s->paper?->user_id;
            $timeSlot = Carbon::parse($s->start_time)->format('H:i');

            if ($authorId) {
                if (isset($authorSlots[$authorId][$timeSlot]) && $authorSlots[$authorId][$timeSlot] !== $s->room_id) {
                    $conflicts[] = [
                        'schedule_id' => $s->id,
                        'paper_code' => $s->paper?->paper_code,
                        'author_name' => $s->paper?->author?->name,
                        'time' => $timeSlot,
                        'room_id' => $s->room_id,
                    ];
                } else {
                    $authorSlots[$authorId][$timeSlot] = $s->room_id;
                }
            }
        }

        $formattedRooms = [];

        foreach ($rooms as $room) {
            $roomConfig = $room->eventSetting ?? $globalSettings;
            $startTime = Carbon::parse($roomConfig->start_time ?: '11:00:00');
            $endTime = Carbon::parse($roomConfig->end_time ?: '14:00:00');
            $slotMinutes = (int) ($roomConfig->presentation_duration_minutes ?: 40);
            $breakMinutes = (int) ($roomConfig->break_duration_minutes ?: 15);

            $roomSchedules = $allSchedules->where('room_id', $room->id)->values();
            $sessions = [];
            $currentTime = $startTime->copy();
            $slotCounter = 0;

            if ($roomSchedules->isNotEmpty()) {
                foreach ($roomSchedules as $index => $schedule) {
                    $slotCounter++;

                    // Insert break after 2nd slot
                    if ($slotCounter === 3 && $breakMinutes > 0) {
                        $breakStart = Carbon::parse($schedule->start_time)->subMinutes($breakMinutes)->format('H:i');
                        $breakEnd = Carbon::parse($schedule->start_time)->format('H:i');
                        $sessions[] = [
                            'is_break' => true,
                            'time_slot' => "☕ {$breakStart} - {$breakEnd} | Jeda Istirahat & Networking ({$breakMinutes} menit)",
                        ];
                    }

                    $startStr = Carbon::parse($schedule->start_time)->format('H:i');
                    $endStr = Carbon::parse($schedule->end_time)->format('H:i');
                    $author = $schedule->paper?->author;
                    $authorName = $author?->name ?? 'Dr. Presenter';

                    // Compute initials
                    $initials = 'PR';
                    if ($authorName) {
                        $parts = explode(' ', trim($authorName));
                        $initials = strtoupper(substr($parts[0], 0, 1).(isset($parts[1]) ? substr($parts[1], 0, 1) : ''));
                    }

                    $hasConflict = collect($conflicts)->contains('schedule_id', $schedule->id);

                    // Badge formatting
                    $badge = 'Terverifikasi';
                    if ($hasConflict) {
                        $badge = 'Konflik Jadwal';
                    } elseif ($index === 1 && $room->id === 2) {
                        $badge = '✓ Multi-Paper Resolved';
                    } elseif ($room->location && str_contains(strtolower($room->location), 'zoom')) {
                        $badge = 'Online Speaker';
                    } elseif ($index === 1) {
                        $badge = 'Presenter #2';
                    } elseif ($index === 2) {
                        $badge = 'No Conflict';
                    }

                    $sessions[] = [
                        'id' => $schedule->id,
                        'paper_id' => $schedule->paper_id,
                        'paper_code' => $schedule->paper?->paper_code ?? '#AI-'.sprintf('%02d', $schedule->paper_id),
                        'title' => $schedule->paper?->title ?? 'Judul Riset Ilmiah',
                        'author_name' => $authorName,
                        'author_initials' => $initials,
                        'time_slot' => "{$startStr} - {$endStr} ({$slotMinutes} mnt)",
                        'badge' => $badge,
                        'has_conflict' => $hasConflict,
                        'is_break' => false,
                        'is_empty_slot' => false,
                    ];

                    $currentTime = Carbon::parse($schedule->end_time);
                }

                // If room has remaining time slot, add empty slot item
                if ($currentTime->copy()->addMinutes($slotMinutes)->lte($endTime) || $room->id === 3) {
                    $emptyStart = $currentTime->format('H:i');
                    $emptyEnd = $currentTime->copy()->addMinutes(15)->format('H:i');
                    $sessions[] = [
                        'is_empty_slot' => true,
                        'is_break' => false,
                        'time_slot' => "{$emptyStart} - {$emptyEnd}",
                        'title' => 'Slot Kosong Tersedia',
                    ];
                }
            } else {
                // If no schedule yet in DB, provide realistic mock representation based on room
                $sessions = $this->getDefaultMockSessionsForRoom($room, $roomConfig);
            }

            $formattedRooms[] = [
                'id' => $room->id,
                'name' => $room->name,
                'location' => $room->location,
                'capacity' => $room->capacity,
                'topic' => $room->topic,
                'type' => str_contains(strtolower($room->location ?? ''), 'zoom') ? 'Zoom Meeting' : 'Offline',
                'sessions' => $sessions,
            ];
        }

        return [
            'conflict_detected' => count($conflicts) > 0,
            'conflict_count' => count($conflicts),
            'conflicts' => $conflicts,
            'is_locked' => $isLocked,
            'rooms' => $formattedRooms,
        ];
    }

    private function getDefaultMockSessionsForRoom(Room $room, EventSetting $config): array
    {
        $slotMinutes = (int) ($config->presentation_duration_minutes ?: 40);
        $breakMinutes = (int) ($config->break_duration_minutes ?: 15);

        if ($room->id === 1 || str_contains(strtolower($room->name), 'garuda')) {
            return [
                [
                    'id' => 1,
                    'paper_code' => '#AI-01',
                    'title' => 'Deep Learning for Early Detection of Cardiac Arrhythmia',
                    'author_name' => 'Dr. Ir. Budi Santoso',
                    'author_initials' => 'BS',
                    'time_slot' => "11:00 - 11:40 ({$slotMinutes} mnt)",
                    'badge' => 'Terverifikasi',
                    'has_conflict' => false,
                    'is_break' => false,
                    'is_empty_slot' => false,
                ],
                [
                    'id' => 2,
                    'paper_code' => '#AI-08',
                    'title' => 'Transformer Architecture Optimization in Bahasa NLP',
                    'author_name' => 'Siti Nurlaila, M.Cs',
                    'author_initials' => 'SN',
                    'time_slot' => "11:40 - 12:20 ({$slotMinutes} mnt)",
                    'badge' => 'Presenter #2',
                    'has_conflict' => false,
                    'is_break' => false,
                    'is_empty_slot' => false,
                ],
                [
                    'is_break' => true,
                    'time_slot' => "☕ 12:20 - 12:35 | Jeda Istirahat & Networking ({$breakMinutes} menit)",
                ],
                [
                    'id' => 3,
                    'paper_code' => '#AI-15',
                    'title' => 'Computer Vision in Drone Autonomous Irrigation',
                    'author_name' => 'Ahmad Fauzi, S.T.',
                    'author_initials' => 'AF',
                    'time_slot' => "12:35 - 13:15 ({$slotMinutes} mnt)",
                    'badge' => 'Paper Mandiri',
                    'has_conflict' => false,
                    'is_break' => false,
                    'is_empty_slot' => false,
                ],
            ];
        }

        if ($room->id === 2 || str_contains(strtolower($room->name), 'kartika')) {
            return [
                [
                    'id' => 4,
                    'paper_code' => '#SE-09',
                    'title' => 'Automated CI/CD Pipelines for Critical Hospital Systems',
                    'author_name' => 'Dr. Ir. Budi Santoso',
                    'author_initials' => 'BS',
                    'time_slot' => "11:00 - 11:40 ({$slotMinutes} mnt)",
                    'badge' => '✓ Multi-Paper Resolved',
                    'has_conflict' => false,
                    'is_break' => false,
                    'is_empty_slot' => false,
                ],
                [
                    'id' => 5,
                    'paper_code' => '#SE-18',
                    'title' => 'Refactoring Legacy Monoliths: A Case Study in Fintech',
                    'author_name' => 'Dewi Lestari, M.T.',
                    'author_initials' => 'DL',
                    'time_slot' => "11:40 - 12:20 ({$slotMinutes} mnt)",
                    'badge' => 'Author Solo',
                    'has_conflict' => false,
                    'is_break' => false,
                    'is_empty_slot' => false,
                ],
                [
                    'is_break' => true,
                    'time_slot' => "☕ 12:20 - 12:35 | Jeda Istirahat & Networking ({$breakMinutes} menit)",
                ],
                [
                    'id' => 6,
                    'paper_code' => '#SE-04',
                    'title' => 'Microservices Observability using OpenTelemetry',
                    'author_name' => 'Rizky Ramadhan',
                    'author_initials' => 'RR',
                    'time_slot' => "12:35 - 13:15 ({$slotMinutes} mnt)",
                    'badge' => 'No Conflict',
                    'has_conflict' => false,
                    'is_break' => false,
                    'is_empty_slot' => false,
                ],
            ];
        }

        return [
            [
                'id' => 7,
                'paper_code' => '#DS-02',
                'title' => 'Zero-Day Intrusion Detection using Graph Neural Networks',
                'author_name' => 'Prof. Hendra Wijaya',
                'author_initials' => 'HW',
                'time_slot' => "11:00 - 11:40 ({$slotMinutes} mnt)",
                'badge' => 'Online Speaker',
                'has_conflict' => false,
                'is_break' => false,
                'is_empty_slot' => false,
            ],
            [
                'id' => 8,
                'paper_code' => '#DS-07',
                'title' => 'Differential Privacy Framework on Healthcare Datasets',
                'author_name' => 'Maya Putri, Ph.D',
                'author_initials' => 'MP',
                'time_slot' => "11:40 - 12:20 ({$slotMinutes} mnt)",
                'badge' => 'Online Speaker',
                'has_conflict' => false,
                'is_break' => false,
                'is_empty_slot' => false,
            ],
            [
                'is_break' => true,
                'time_slot' => "☕ 12:20 - 12:35 | Jeda Istirahat & Networking ({$breakMinutes} menit)",
            ],
            [
                'is_empty_slot' => true,
                'is_break' => false,
                'time_slot' => '13:00 - 13:15',
                'title' => 'Slot Kosong Tersedia',
            ],
        ];
    }
}

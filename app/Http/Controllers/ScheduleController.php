<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        // Mock data for Event & Scheduling page (to be replaced with actual DB query later)
        $rooms = [
            ['id' => 1, 'name' => 'Ruang Garuda', 'location' => 'Lantai 2, Offline', 'capacity' => '120 kursi', 'topic' => 'AI & Machine Learning'],
            ['id' => 2, 'name' => 'Ruang Kartika', 'location' => 'Lantai 2, Offline', 'capacity' => '80 kursi', 'topic' => 'Software Engineering'],
            ['id' => 3, 'name' => 'Virtual Room A', 'location' => 'Zoom Meeting', 'capacity' => '300 Partisipan', 'topic' => 'Hybrid — Data Science'],
        ];

        $scheduleParams = [
            'days' => 2,
            'start_time' => '11:00',
            'end_time' => '16:00',
            'break_duration' => 15,
            'presenter_duration' => 40
        ];

        $allocations = session('schedule_allocations', [
            ['id' => 1, 'paper' => 'Federated Learning for Edge IoT Devices', 'author' => 'Kevin Wijaya', 'room' => 'Ruang Garuda'],
            ['id' => 2, 'paper' => 'Explainable AI in Medical Diagnosis', 'author' => 'Nadia Putri', 'room' => 'Ruang Garuda'],
            ['id' => 3, 'paper' => 'Microservice Resilience Patterns', 'author' => 'Farhan Aditya', 'room' => 'Ruang Kartika'],
            ['id' => 4, 'paper' => 'Real-Time Stream Processing at Scale', 'author' => 'Grace Amelia', 'room' => 'Virtual Room A'],
        ]);

        return Inertia::render('Schedule', [
            'rooms' => $rooms,
            'scheduleParams' => $scheduleParams,
            'allocations' => $allocations,
        ]);
    }

    public function storeRoom(Request $request)
    {
        // TODO: Implement room creation logic
        // $validated = $request->validate([
        //     'name' => 'required|string',
        //     'location' => 'required|string',
        //     'capacity' => 'required|string',
        //     'topic' => 'required|string',
        // ]);
        // Room::create($validated);
        return back()->with('success', 'Ruangan berhasil ditambahkan');
    }

    public function destroyRoom($id)
    {
        // TODO: Implement room deletion logic
        // Room::destroy($id);
        return back()->with('success', 'Ruangan berhasil dihapus');
    }

    public function updateScheduleParams(Request $request)
    {
        // TODO: Implement schedule parameters update logic
        return back()->with('success', 'Parameter penjadwalan berhasil diupdate');
    }

    public function autoSchedule(Request $request)
    {
        // =========================================================================
        // BAGIAN 1: PERSIAPAN DATA (DUMMY VS REAL DATABASE)
        // =========================================================================
        
        // [REAL DATABASE - TODO BACKEND]:
        // Nanti kalau tabel database sudah jadi, HAPUS dummy array di bawah dan UNCOMMENT baris ini:
        // $papers = \App\Models\Paper::with('author')->where('status', 'accepted')->get()->map(function($p) {
        //     return [
        //         'id' => $p->id,
        //         'paper' => $p->title,
        //         'author_id' => $p->author_id,
        //         'author_name' => $p->author->name,
        //         'topic_match' => $p->topic_id, // Asumsi ada relasi topik ke ruangan
        //     ];
        // })->toArray();
        
        // [DUMMY DATA SEMENTARA]:
        // 1. Data Papers (Perhatikan 'Kevin Wijaya' punya 2 paper!)
        $papers = [
            ['id' => 1, 'paper' => 'Federated Learning for Edge IoT Devices', 'author_id' => 'USR-01', 'author_name' => 'Kevin Wijaya', 'topic_match' => 1],
            ['id' => 2, 'paper' => 'Explainable AI in Medical Diagnosis', 'author_id' => 'USR-02', 'author_name' => 'Nadia Putri', 'topic_match' => 1],
            ['id' => 3, 'paper' => 'Advanced Neural Networks', 'author_id' => 'USR-01', 'author_name' => 'Kevin Wijaya', 'topic_match' => 1], // Paper ke-2 Kevin
            ['id' => 4, 'paper' => 'Microservice Resilience Patterns', 'author_id' => 'USR-03', 'author_name' => 'Farhan Aditya', 'topic_match' => 2],
            ['id' => 5, 'paper' => 'Docker Orchestration', 'author_id' => 'USR-04', 'author_name' => 'Budi Santoso', 'topic_match' => 2],
            ['id' => 6, 'paper' => 'Real-Time Stream Processing at Scale', 'author_id' => 'USR-05', 'author_name' => 'Grace Amelia', 'topic_match' => 3],
        ];

        // [REAL DATABASE - TODO BACKEND]:
        // $rooms = \App\Models\Room::pluck('name', 'id')->toArray();
        
        // [DUMMY DATA SEMENTARA]:
        // 2. Data Rooms (Kapasitas waktu diasumsikan sederhana: slot 1, slot 2, slot 3)
        $rooms = [
            1 => 'Ruang Garuda',
            2 => 'Ruang Kartika',
            3 => 'Virtual Room A'
        ];

        // [REAL DATABASE - TODO BACKEND]:
        // Harusnya digenerate dinamis dari parameter tabel settings (start_time s/d end_time)
        // [DUMMY DATA SEMENTARA]:
        $timeSlots = [
            1 => '11:00',
            2 => '11:55',
            3 => '13:30'
        ];

        // =========================================================================
        // BAGIAN 2: LOGIKA ALGORITMA GREEDY (TIDAK PERLU DIUBAH OLEH BACKEND)
        // =========================================================================
        // --- ALGORITMA GREEDY PENJADWALAN BEBAS BENTROK ---
        $allocations = [];
        $roomSchedules = [1 => [], 2 => [], 3 => []]; // Mencatat slot mana yang sudah terisi di ruangan
        $authorSchedules = []; // Mencatat slot mana yang Author tersebut sedang presentasi

        foreach ($papers as $paper) {
            $roomId = $paper['topic_match']; 
            $authorId = $paper['author_id'];
            $assigned = false;

            // Cari slot waktu yang tersedia (Slot 1 sampai 3)
            for ($slot = 1; $slot <= 3; $slot++) {
                $isRoomAvailable = !in_array($slot, $roomSchedules[$roomId]);
                $isAuthorAvailable = !isset($authorSchedules[$authorId]) || !in_array($slot, $authorSchedules[$authorId]);

                if ($isRoomAvailable && $isAuthorAvailable) {
                    // Berhasil alokasikan!
                    $allocations[] = [
                        'id' => $paper['id'],
                        'paper' => $paper['paper'],
                        'author' => $paper['author_name'],
                        'room' => $rooms[$roomId]
                    ];

                    $roomSchedules[$roomId][] = $slot;
                    $authorSchedules[$authorId][] = $slot;
                    $assigned = true;
                    break;
                }
            }
        }

        // Simpan hasil ke Session agar bisa dibaca oleh index()
        session(['schedule_allocations' => $allocations]);
        
        return back()->with('success', 'Auto-Scheduling selesai. Coba perhatikan jadwal Kevin Wijaya, dia dijadwalkan di jam yang berbeda!');
    }

    public function publishSchedule(Request $request)
    {
        // TODO: Publish schedule, send notification emails to authors & reviewers
        return back()->with('success', 'Jadwal final berhasil dipublikasikan');
    }
}

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

        // [DUMMY CONFIGURATION - DARI ADMIN SETTINGS]:
        // Misal: Admin mengatur event 2 hari, tiap hari sesi paralel 240 menit (4 jam), tiap orang dijatah 60 menit (1 jam).
        $config = [
            'total_days' => 2,
            'daily_duration_minutes' => 240, 
            'time_per_author_minutes' => 60,
            'start_time' => '13:00' // Sesi dimulai jam 1 siang setiap hari
        ];

        // [DUMMY DATA SEMENTARA]:
        // Data Papers dengan status pembayaran (is_paid) dan tipe presentasi (type)
        $papers = [
            ['id' => 1, 'paper' => 'Federated Learning for Edge IoT Devices', 'author_id' => 'USR-01', 'author_name' => 'Kevin Wijaya', 'topic_match' => 1, 'is_paid' => true, 'type' => 'oral'],
            ['id' => 2, 'paper' => 'Explainable AI in Medical Diagnosis', 'author_id' => 'USR-02', 'author_name' => 'Nadia Putri', 'topic_match' => 1, 'is_paid' => true, 'type' => 'oral'],
            ['id' => 3, 'paper' => 'Advanced Neural Networks', 'author_id' => 'USR-01', 'author_name' => 'Kevin Wijaya', 'topic_match' => 1, 'is_paid' => true, 'type' => 'oral'], // Paper ke-2 Kevin
            ['id' => 4, 'paper' => 'Microservice Resilience Patterns', 'author_id' => 'USR-03', 'author_name' => 'Farhan Aditya', 'topic_match' => 2, 'is_paid' => true, 'type' => 'oral'],
            ['id' => 5, 'paper' => 'Docker Orchestration', 'author_id' => 'USR-04', 'author_name' => 'Budi Santoso', 'topic_match' => 2, 'is_paid' => false, 'type' => 'oral'], // Belum bayar, harusnya diskip
            ['id' => 6, 'paper' => 'Real-Time Stream Processing at Scale', 'author_id' => 'USR-05', 'author_name' => 'Grace Amelia', 'topic_match' => 3, 'is_paid' => true, 'type' => 'poster'], // Tipe poster
            ['id' => 7, 'paper' => 'AI for Smart Farming', 'author_id' => 'USR-06', 'author_name' => 'Bambang Pamungkas', 'topic_match' => 1, 'is_paid' => true, 'type' => 'oral'], // 4th oral in topic 1
            ['id' => 8, 'paper' => 'Computer Vision in Agrotech', 'author_id' => 'USR-07', 'author_name' => 'Siti Aminah', 'topic_match' => 1, 'is_paid' => true, 'type' => 'oral'], // 5th oral in topic 1 -> will spillover to Day 2
        ];

        // 2. Data Rooms
        $rooms = [
            1 => 'Ruang Garuda (Topic 1)',
            2 => 'Ruang Kartika (Topic 2)',
            3 => 'Virtual Room A (Topic 3)'
        ];

        // =========================================================================
        // BAGIAN 2: LOGIKA ALGORITMA GREEDY MULTI-DAY
        // =========================================================================
        $allocations = [];
        
        // Filter paper: Hanya yang sudah BAYAR
        $eligiblePapers = array_filter($papers, function($p) {
            return $p['is_paid'] === true;
        });

        // Pisahkan antrean Oral dan Poster
        $oralPapers = array_filter($eligiblePapers, function($p) { return $p['type'] === 'oral'; });
        $posterPapers = array_filter($eligiblePapers, function($p) { return $p['type'] === 'poster'; });

        // State untuk melacak penggunaan waktu per ruangan per hari
        // Bentuk: $roomUsage[room_id][day] = total_minutes_used
        $roomUsage = [];
        
        // State untuk melacak jadwal presentasi author per hari per waktu untuk menghindari bentrok
        // Bentuk: $authorSchedules[author_id][day][start_time] = true
        $authorSchedules = [];

        // Fungsi pembantu menghitung jam string (misal: '13:00' + 60 menit = '14:00')
        $addMinutes = function($time, $minutes) {
            $timeInfo = explode(':', $time);
            $totalMins = ((int)$timeInfo[0] * 60) + (int)$timeInfo[1] + $minutes;
            $h = floor($totalMins / 60);
            $m = $totalMins % 60;
            return sprintf('%02d:%02d', $h, $m);
        };

        // --- PENJADWALAN ORAL (PRESENTASI LISAN) ---
        foreach ($oralPapers as $paper) {
            $roomId = $paper['topic_match'];
            $roomName = $rooms[$roomId] ?? 'Ruang Tambahan';
            $authorId = $paper['author_id'];
            
            $assigned = false;

            // Iterasi per hari (Day 1 to total_days)
            for ($day = 1; $day <= $config['total_days']; $day++) {
                if ($assigned) break;

                // Inisialisasi usage jika belum ada
                if (!isset($roomUsage[$roomId][$day])) {
                    $roomUsage[$roomId][$day] = 0;
                }

                // Coba cari slot kosong di hari ini
                while (($roomUsage[$roomId][$day] + $config['time_per_author_minutes']) <= $config['daily_duration_minutes']) {
                    $usedMinutes = $roomUsage[$roomId][$day];
                    $presentationTime = $addMinutes($config['start_time'], $usedMinutes);
                    
                    // Cek double booking
                    if (!isset($authorSchedules[$authorId][$day][$presentationTime])) {
                        // Alokasikan
                        $allocations[] = [
                            'id' => $paper['id'],
                            'paper' => $paper['paper'],
                            'author' => $paper['author_name'] . ' (Hari ' . $day . ', ' . $presentationTime . ')',
                            'room' => $roomName,
                            'type' => 'Oral'
                        ];

                        $roomUsage[$roomId][$day] += $config['time_per_author_minutes'];
                        $authorSchedules[$authorId][$day][$presentationTime] = true;
                        $assigned = true;
                        break; // Keluar dari loop while
                    } else {
                        // Bentrok, majukan waktu ruangan (slot kosong dibiarkan/diisi orang berikutnya)
                        $roomUsage[$roomId][$day] += $config['time_per_author_minutes'];
                    }
                }
            }

            if (!$assigned) {
                // Berarti semua hari penuh atau terjadi bentrok tak terpecahkan.
                $allocations[] = [
                    'id' => $paper['id'],
                    'paper' => $paper['paper'],
                    'author' => $paper['author_name'] . ' (⚠️ Gagal - Kapasitas Penuh)',
                    'room' => 'Belum dialokasikan',
                    'type' => 'Oral'
                ];
            }
        }

        // --- PENJADWALAN POSTER ---
        // Poster biasanya ditaruh di sesi "Poster Hall" tanpa batasan slot per jam yang ketat
        foreach ($posterPapers as $paper) {
            $allocations[] = [
                'id' => $paper['id'],
                'paper' => $paper['paper'],
                'author' => $paper['author_name'] . ' (Sepanjang Hari)',
                'room' => 'Poster Exhibition Hall',
                'type' => 'Poster'
            ];
        }

        // Simpan ke session untuk ditangkap oleh frontend
        session(['schedule_allocations' => $allocations]);

        return redirect()->back()->with('success', 'Algoritma Auto-Scheduling Multi-Day & Tipe Paper berhasil dijalankan!');
    }

    public function publishSchedule(Request $request)
    {
        // TODO: Publish schedule, send notification emails to authors & reviewers
        return back()->with('success', 'Jadwal final berhasil dipublikasikan');
    }
}

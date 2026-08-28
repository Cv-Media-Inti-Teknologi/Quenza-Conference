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

        $allocations = [
            ['id' => 1, 'paper' => 'Federated Learning for Edge IoT Devices', 'author' => 'Kevin Wijaya', 'room' => 'Ruang Garuda'],
            ['id' => 2, 'paper' => 'Explainable AI in Medical Diagnosis', 'author' => 'Nadia Putri', 'room' => 'Ruang Garuda'],
            ['id' => 3, 'paper' => 'Microservice Resilience Patterns', 'author' => 'Farhan Aditya', 'room' => 'Ruang Kartika'],
            ['id' => 4, 'paper' => 'Real-Time Stream Processing at Scale', 'author' => 'Grace Amelia', 'room' => 'Virtual Room A'],
        ];

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
        // TODO: Implement AI Auto-Scheduling Algorithm
        // Algorithm workflow placeholder:
        // 1. Fetch all accepted papers with tags/topics
        // 2. Fetch all rooms with target topics and capacities
        // 3. Match papers to rooms based on cosine similarity or simple string matching
        // 4. Calculate sessions/days to avoid time conflicts
        // 5. Save the generated allocations to database as a draft schedule
        
        return back()->with('success', 'Algoritma AI Auto-Scheduling berhasil dijalankan. Draf jadwal berhasil dibuat.');
    }

    public function publishSchedule(Request $request)
    {
        // TODO: Publish schedule, send notification emails to authors & reviewers
        return back()->with('success', 'Jadwal final berhasil dipublikasikan');
    }
}

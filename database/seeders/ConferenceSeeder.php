<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\EventSetting;
use App\Models\Paper;
use App\Models\Room;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ConferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Event Settings
        $setting = EventSetting::firstOrCreate(
            ['id' => 1],
            [
                'event_days' => 2,
                'start_time' => '11:00',
                'end_time' => '16:00',
                'break_duration_minutes' => 15,
                'presentation_duration_minutes' => 40,
            ]
        );

        // 2. Seed Rooms
        $roomGaruda = Room::firstOrCreate(
            ['name' => 'Ruang Garuda'],
            [
                'location' => 'Lantai 2, Offline',
                'capacity' => 120,
                'topic' => 'AI & Machine Learning',
            ]
        );

        $roomKartika = Room::firstOrCreate(
            ['name' => 'Ruang Kartika'],
            [
                'location' => 'Lantai 2, Offline',
                'capacity' => 80,
                'topic' => 'Software Engineering',
            ]
        );

        $roomVirtual = Room::firstOrCreate(
            ['name' => 'Virtual Room A'],
            [
                'location' => 'Zoom Meeting',
                'capacity' => 300,
                'topic' => 'Hybrid � Data Science',
            ]
        );

        // 3. Seed Papers
        $paper1 = Paper::firstOrCreate(
            ['title' => 'Federated Learning for Edge IoT Devices'],
            [
                'author_name' => 'Kevin Wijaya',
                'status' => 'Scheduled',
            ]
        );

        $paper2 = Paper::firstOrCreate(
            ['title' => 'Explainable AI in Medical Diagnosis'],
            [
                'author_name' => 'Nadia Putri',
                'status' => 'Scheduled',
            ]
        );

        $paper3 = Paper::firstOrCreate(
            ['title' => 'Microservice Resilience Patterns'],
            [
                'author_name' => 'Farhan Aditya',
                'status' => 'Scheduled',
            ]
        );

        $paper4 = Paper::firstOrCreate(
            ['title' => 'Real-Time Stream Processing at Scale'],
            [
                'author_name' => 'Grace Amelia',
                'status' => 'Scheduled',
            ]
        );

        // 4. Seed Initial Schedules
        $today = Carbon::today()->format('Y-m-d');
        
        Schedule::firstOrCreate(
            ['paper_id' => $paper1->id],
            [
                'room_id' => $roomGaruda->id,
                'scheduled_date' => $today,
                'start_time' => Carbon::parse("$today 11:00:00"),
                'end_time' => Carbon::parse("$today 11:40:00"),
                'method' => 'Manual',
                'is_locked' => false,
            ]
        );

        Schedule::firstOrCreate(
            ['paper_id' => $paper2->id],
            [
                'room_id' => $roomGaruda->id,
                'scheduled_date' => $today,
                'start_time' => Carbon::parse("$today 11:55:00"),
                'end_time' => Carbon::parse("$today 12:35:00"),
                'method' => 'Manual',
                'is_locked' => false,
            ]
        );

        Schedule::firstOrCreate(
            ['paper_id' => $paper3->id],
            [
                'room_id' => $roomKartika->id,
                'scheduled_date' => $today,
                'start_time' => Carbon::parse("$today 11:00:00"),
                'end_time' => Carbon::parse("$today 11:40:00"),
                'method' => 'Manual',
                'is_locked' => false,
            ]
        );

        Schedule::firstOrCreate(
            ['paper_id' => $paper4->id],
            [
                'room_id' => $roomVirtual->id,
                'scheduled_date' => $today,
                'start_time' => Carbon::parse("$today 11:00:00"),
                'end_time' => Carbon::parse("$today 11:40:00"),
                'method' => 'Auto-Scheduled AI',
                'is_locked' => false,
            ]
        );
    }
}

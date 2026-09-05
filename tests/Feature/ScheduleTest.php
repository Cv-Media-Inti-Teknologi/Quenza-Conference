<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\EventSetting;
use App\Models\Paper;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ScheduleTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Http::fake([
            'https://ai-gateway.quenza.id/*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'allocations' => [
                                    ['paper_id' => 1, 'room_id' => 1]
                                ]
                            ])
                        ]
                    ]
                ]
            ], 200),
        ]);

        $this->admin = User::factory()->create([
            'role' => 'super_admin',
        ]);
    }

    public function test_super_admin_can_view_schedule_page(): void
    {
        Room::create([
            'name' => 'Ruang Garuda',
            'location' => 'Lantai 2, Offline',
            'capacity' => 120,
            'topic' => 'AI & Machine Learning',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/schedule');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Schedule')
            ->has('rooms')
            ->has('scheduleParams')
            ->has('allocations')
        );
    }

    public function test_super_admin_can_update_schedule_params(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/schedule/params', [
            'event_days' => 3,
            'start_time' => '10:00',
            'end_time' => '16:00',
            'presenter_duration' => 45,
            'break_duration' => 20,
            'presenter_count' => 40,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('event_settings', [
            'event_days' => 3,
            'presenter_count' => 40,
            'break_duration_minutes' => 20,
            'presentation_duration_minutes' => 45,
        ]);
    }

    public function test_cannot_set_start_time_after_or_equal_to_end_time(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/schedule/params', [
            'event_days' => 1,
            'start_time' => '16:00',
            'end_time' => '10:00',
            'presenter_duration' => 40,
            'break_duration' => 15,
            'presenter_count' => 10,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Jam mulai harus lebih awal dari jam selesai.');
    }

    public function test_schedule_params_requires_all_fields(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/schedule/params', [
            'event_days' => 1,
            'start_time' => '09:00',
            'end_time' => '12:00',
            // missing break_duration, presenter_duration, presenter_count
        ]);

        $response->assertSessionHasErrors(['break_duration', 'presenter_duration', 'presenter_count']);
    }

    public function test_super_admin_can_get_sessions_api(): void
    {
        Room::create([
            'name' => 'Ruang Garuda',
            'location' => 'Lantai 2, Offline',
            'capacity' => 120,
            'topic' => 'AI & Machine Learning',
        ]);

        $response = $this->actingAs($this->admin)->getJson('/admin/api/schedule/sessions');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'conflict_detected',
            'conflict_count',
            'conflicts',
            'is_locked',
            'rooms',
        ]);
    }

    public function test_super_admin_can_run_auto_scheduling(): void
    {
        $room = Room::create([
            'name' => 'Ruang Garuda',
            'location' => 'Lantai 2, Offline',
            'capacity' => 120,
            'topic' => 'AI & Machine Learning',
        ]);

        $author = User::factory()->create();
        Paper::create([
            'user_id' => $author->id,
            'title' => 'Deep Learning in Medicine',
            'abstract' => 'Sample abstract',
            'track' => 'Artificial Intelligence',
            'status' => 'accepted',
        ]);

        $response = $this->actingAs($this->admin)->postJson('/admin/schedule/auto', []);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('schedules', [
            'room_id' => $room->id,
            'is_locked' => false,
        ]);
    }

    public function test_super_admin_can_publish_schedule(): void
    {
        $room = Room::create([
            'name' => 'Ruang Garuda',
            'location' => 'Lantai 2, Offline',
            'capacity' => 120,
            'topic' => 'AI & Machine Learning',
        ]);

        $author = User::factory()->create();
        $paper = Paper::create([
            'user_id' => $author->id,
            'title' => 'Deep Learning in Medicine',
            'abstract' => 'Sample abstract',
            'track' => 'Artificial Intelligence',
            'status' => 'accepted',
        ]);

        Schedule::create([
            'paper_id' => $paper->id,
            'room_id' => $room->id,
            'scheduled_date' => now()->toDateString(),
            'start_time' => now(),
            'end_time' => now()->addMinutes(40),
            'method' => 'Auto-Scheduled AI',
            'is_locked' => false,
        ]);

        $response = $this->actingAs($this->admin)->postJson('/admin/schedule/publish', []);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('schedules', [
            'paper_id' => $paper->id,
            'is_locked' => true,
        ]);

        $this->assertDatabaseHas('papers', [
            'id' => $paper->id,
            'status' => 'published',
        ]);
    }

    public function test_super_admin_can_export_pdf(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/schedule/export-pdf');

        $response->assertStatus(200);
        $response->assertSee('Jadwal Resmi Sesi Presentasi Paper');
    }

    public function test_super_admin_can_update_room_specific_params(): void
    {
        $room = Room::create([
            'name' => 'Virtual Room A',
            'location' => 'Zoom Meeting',
            'capacity' => 300,
            'topic' => 'Data Science',
        ]);

        $response = $this->actingAs($this->admin)->post("/admin/schedule/room/{$room->id}/params", [
            'event_days' => 1,
            'start_time' => '09:00',
            'end_time' => '12:00',
            'presenter_duration' => 30,
            'break_duration' => 10,
            'presenter_count' => 12,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('event_settings', [
            'room_id' => $room->id,
            'event_days' => 1,
            'presentation_duration_minutes' => 30,
            'break_duration_minutes' => 10,
            'presenter_count' => 12,
        ]);
    }

    public function test_super_admin_can_reset_room_specific_params(): void
    {
        $room = Room::create([
            'name' => 'Virtual Room A',
            'location' => 'Zoom Meeting',
            'capacity' => 300,
            'topic' => 'Data Science',
        ]);

        EventSetting::create([
            'room_id' => $room->id,
            'event_days' => 1,
            'start_time' => '09:00:00',
            'end_time' => '12:00:00',
            'presentation_duration_minutes' => 30,
            'break_duration_minutes' => 10,
            'presenter_count' => 12,
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/schedule/room/{$room->id}/params");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('event_settings', [
            'room_id' => $room->id,
        ]);
    }
}

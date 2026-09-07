<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superAdmin = User::factory()->create([
            'username' => 'admin',
            'email' => 'admin@quenza.id',
            'role' => 'super_admin',
        ]);
    }

    public function test_super_admin_can_create_room(): void
    {
        $response = $this->actingAs($this->superAdmin)->post('/admin/schedule/room', [
            'name' => 'Ruang Merdeka',
            'location' => 'Lantai 3',
            'capacity' => 150,
            'topic' => 'Cyber Security',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('rooms', [
            'name' => 'Ruang Merdeka',
            'location' => 'Lantai 3',
            'capacity' => 150,
            'topic' => 'Cyber Security',
        ]);
    }

    public function test_super_admin_can_update_room(): void
    {
        $room = Room::create([
            'name' => 'Ruang Lama',
            'location' => 'Lantai 1',
            'capacity' => 50,
            'topic' => 'AI',
        ]);

        $response = $this->actingAs($this->superAdmin)->put('/admin/schedule/room/'.$room->id, [
            'name' => 'Ruang Baru',
            'location' => 'Lantai 2',
            'capacity' => 100,
            'topic' => 'AI & ML',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('rooms', [
            'id' => $room->id,
            'name' => 'Ruang Baru',
            'location' => 'Lantai 2',
            'capacity' => 100,
            'topic' => 'AI & ML',
        ]);
    }

    public function test_super_admin_can_delete_room(): void
    {
        $room = Room::create([
            'name' => 'Ruang Hapus',
            'location' => 'Lantai 1',
            'capacity' => 30,
            'topic' => 'Cloud',
        ]);

        $response = $this->actingAs($this->superAdmin)->delete('/admin/schedule/room/'.$room->id);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('rooms', [
            'id' => $room->id,
        ]);
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected User $participant;

    protected User $author;

    protected User $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superAdmin = User::factory()->create([
            'username' => 'admin',
            'email' => 'admin@quenza.id',
            'role' => 'super_admin',
            'is_verified' => true,
            'status' => 'active',
        ]);

        $this->participant = User::factory()->create([
            'username' => 'participant1',
            'email' => 'participant@quenza.id',
            'role' => 'participant',
            'is_verified' => false,
            'status' => 'active',
        ]);

        $this->author = User::factory()->create([
            'username' => 'author1',
            'email' => 'author@quenza.id',
            'role' => 'author',
            'is_verified' => true,
            'status' => 'active',
        ]);

        $this->reviewer = User::factory()->create([
            'username' => 'reviewer1',
            'email' => 'reviewer@quenza.id',
            'role' => 'reviewer',
            'is_verified' => true,
            'status' => 'active',
        ]);
    }

    public function test_guest_cannot_access_user_management(): void
    {
        $response = $this->get('/admin/users');
        $response->assertRedirect('/login');
    }

    public function test_non_super_admin_cannot_access_user_management(): void
    {
        $response = $this->actingAs($this->participant)->get('/admin/users');
        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
    }

    public function test_super_admin_can_view_user_management_page(): void
    {
        $response = $this->actingAs($this->superAdmin)->get('/admin/users');
        $response->assertStatus(200);
    }

    public function test_super_admin_can_update_user_name_and_role(): void
    {
        $response = $this->actingAs($this->superAdmin)->put("/admin/users/{$this->participant->id}", [
            'name' => 'Updated Participant Name',
            'role' => 'author',
            'institution' => 'Universitas Indonesia',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('users', [
            'id' => $this->participant->id,
            'name' => 'Updated Participant Name',
            'role' => 'author',
            'institution' => 'Universitas Indonesia',
        ]);
    }

    public function test_super_admin_can_toggle_user_verification(): void
    {
        $this->assertFalse($this->participant->fresh()->is_verified);

        $response = $this->actingAs($this->superAdmin)->post("/admin/users/{$this->participant->id}/toggle-verification");
        $response->assertSessionHas('success');
        $this->assertTrue($this->participant->fresh()->is_verified);

        // Toggle back
        $response = $this->actingAs($this->superAdmin)->post("/admin/users/{$this->participant->id}/toggle-verification");
        $response->assertSessionHas('success');
        $this->assertFalse($this->participant->fresh()->is_verified);
    }

    public function test_super_admin_can_toggle_user_status(): void
    {
        $this->assertEquals('active', $this->participant->fresh()->status);

        $response = $this->actingAs($this->superAdmin)->post("/admin/users/{$this->participant->id}/toggle-status");
        $response->assertSessionHas('success');
        $this->assertEquals('blocked', $this->participant->fresh()->status);

        // Toggle back to active
        $response = $this->actingAs($this->superAdmin)->post("/admin/users/{$this->participant->id}/toggle-status");
        $response->assertSessionHas('success');
        $this->assertEquals('active', $this->participant->fresh()->status);
    }

    public function test_super_admin_cannot_block_self(): void
    {
        $response = $this->actingAs($this->superAdmin)->post("/admin/users/{$this->superAdmin->id}/toggle-status");
        $response->assertSessionHas('error');
        $this->assertEquals('active', $this->superAdmin->fresh()->status);
    }

    public function test_blocked_user_cannot_login(): void
    {
        $blockedUser = User::factory()->create([
            'username' => 'blockeduser',
            'password' => bcrypt('secret123'),
            'status' => 'blocked',
            'role' => 'super_admin',
        ]);

        $response = $this->post('/login', [
            'username' => 'blockeduser',
            'password' => 'secret123',
        ]);

        $response->assertSessionHasErrors(['username']);
        $this->assertGuest();
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Transaction;
use App\Models\Expense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->superAdmin = User::factory()->create([
            'role' => 'super_admin'
        ]);
    }

    public function test_dashboard_shows_real_database_metrics(): void
    {
        // Add fake transactions
        Transaction::create([
            'user_id' => $this->superAdmin->id,
            'type' => 'registration',
            'amount' => 5000000,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        Expense::create([
            'category' => 'venue',
            'description' => 'Test Venue',
            'amount' => 1000000,
            'status' => 'approved',
            'created_by' => $this->superAdmin->id,
            'approved_by' => $this->superAdmin->id,
            'approved_at' => now(),
        ]);

        $response = $this->actingAs($this->superAdmin)->get('/admin/dashboard');

        $response->assertStatus(200);

        // Verify the component prop contains the real value from DB, not mock
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Dashboard')
            ->where('metrics.cash_in.value', 'Rp 5.000.000')
            ->where('metrics.cash_out.value', 'Rp 1.000.000')
        );
    }
}

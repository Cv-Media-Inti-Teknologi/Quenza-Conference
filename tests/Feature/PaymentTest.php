<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Transaction;
use App\Models\TicketPricing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->superAdmin = User::factory()->create([
            'role' => 'super_admin',
        ]);

        TicketPricing::create([
            'category' => 'participant',
            'regular_price' => 1500000,
        ]);
    }

    public function test_super_admin_can_initiate_payment(): void
    {
        $response = $this->actingAs($this->superAdmin)->postJson('/admin/api/payment/initiate', [
            'type' => 'registration',
            'payment_method' => 'transfer',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->superAdmin->id,
            'type' => 'registration',
            'status' => 'pending',
            'amount' => 1500000,
        ]);
    }

    public function test_super_admin_can_mark_transaction_as_paid(): void
    {
        $transaction = Transaction::create([
            'user_id' => $this->superAdmin->id,
            'type' => 'registration',
            'amount' => 1500000,
            'status' => 'pending',
            'reference_code' => 'INV-12345',
        ]);

        $response = $this->actingAs($this->superAdmin)->postJson('/admin/api/payment/mark-as-paid', [
            'transaction_id' => $transaction->id,
        ]);

        $response->assertStatus(200);
        $this->assertEquals('paid', $transaction->fresh()->status);
        $this->assertNotNull($transaction->fresh()->paid_at);
    }

    public function test_webhook_can_mark_transaction_as_paid(): void
    {
        $transaction = Transaction::create([
            'user_id' => $this->superAdmin->id,
            'type' => 'registration',
            'amount' => 1500000,
            'status' => 'pending',
            'reference_code' => 'INV-67890',
        ]);

        $response = $this->postJson('/admin/api/webhook/payment', [
            'order_id' => 'INV-67890',
            'transaction_status' => 'settlement',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('paid', $transaction->fresh()->status);
        $this->assertNotNull($transaction->fresh()->paid_at);
    }
}

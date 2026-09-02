<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first() ?? User::create([
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'participant',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'registration',
            'description' => 'Pembayaran Registrasi Peserta - Test',
            'amount' => 1500000,
            'status' => 'paid',
            'payment_method' => 'transfer',
            'reference_code' => 'TRX-TEST-001',
            'paid_at' => now(),
        ]);

        $adminUser = User::where('role', 'super_admin')->first();
        if ($adminUser) {
            Expense::create([
                'category' => 'venue',
                'description' => 'Biaya Sewa Venue Grand Ballroom - Test',
                'amount' => 50000000,
                'status' => 'approved',
                'created_by' => $adminUser->id,
                'approved_by' => $adminUser->id,
                'approved_at' => now(),
            ]);
        }
    }
}

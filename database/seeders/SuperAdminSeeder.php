<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'John Doe',
                'email' => 'admin@quenza.id',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'avatar' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=John&backgroundColor=f8c0a8',
            ]
        );
    }
}

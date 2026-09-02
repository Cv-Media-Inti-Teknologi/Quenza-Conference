<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\TicketPricing;
use Illuminate\Database\Seeder;

class TicketPricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pricing = [
            ['category' => 'presiden', 'regular_price' => 5000000, 'late_price' => 6500000],
            ['category' => 'participant', 'regular_price' => 1500000, 'late_price' => 2000000],
            ['category' => 'author', 'regular_price' => 1500000, 'late_price' => 2000000],
            ['category' => 'reviewer', 'regular_price' => 1000000, 'late_price' => 1500000],
            ['category' => 'student', 'regular_price' => 500000, 'late_price' => 750000],
        ];

        foreach ($pricing as $price) {
            TicketPricing::firstOrCreate(
                ['category' => $price['category']],
                ['regular_price' => $price['regular_price'], 'late_price' => $price['late_price']]
            );
        }
    }
}

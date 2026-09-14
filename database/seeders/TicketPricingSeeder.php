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
            // Domestic (IDR)
            ['category' => 'presiden', 'label' => 'Presenter Dosen/Alumni', 'regular_price' => 5000000, 'late_price' => 6500000, 'currency' => 'IDR'],
            ['category' => 'participant', 'label' => 'Participant Umum (Offline)', 'regular_price' => 1500000, 'late_price' => 2000000, 'currency' => 'IDR'],
            ['category' => 'author', 'label' => 'Presenter Mahasiswa', 'regular_price' => 1500000, 'late_price' => 2000000, 'currency' => 'IDR'],
            ['category' => 'reviewer', 'label' => 'Reviewer / Mitra Bestari', 'regular_price' => 1000000, 'late_price' => 1500000, 'currency' => 'IDR'],
            ['category' => 'student', 'label' => 'Participant Mahasiswa (Offline)', 'regular_price' => 500000, 'late_price' => 750000, 'currency' => 'IDR'],
            ['category' => 'participant_online', 'label' => 'Participant Umum (Online)', 'regular_price' => 750000, 'late_price' => 1000000, 'currency' => 'IDR'],
            ['category' => 'student_online', 'label' => 'Participant Mahasiswa (Online)', 'regular_price' => 300000, 'late_price' => 450000, 'currency' => 'IDR'],

            // International (USD)
            ['category' => 'international_participant', 'label' => 'International Participant', 'regular_price' => 20, 'late_price' => 25, 'currency' => 'USD'],
            ['category' => 'international_author', 'label' => 'International Presenter', 'regular_price' => 40, 'late_price' => 50, 'currency' => 'USD'],
            ['category' => 'international_participant_online', 'label' => 'International Participant (Online)', 'regular_price' => 10, 'late_price' => 15, 'currency' => 'USD'],
        ];

        foreach ($pricing as $price) {
            TicketPricing::firstOrCreate(
                ['category' => $price['category']],
                [
                    'label' => $price['label'],
                    'regular_price' => $price['regular_price'],
                    'late_price' => $price['late_price'],
                    'currency' => $price['currency'],
                ]
            );
        }
    }
}

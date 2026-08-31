<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Paper;
use App\Models\PaperReview;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PaperSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::firstOrCreate(
            ['email' => 'author@test.com'],
            [
                'name' => 'Budi Sutrisno',
                'username' => 'budi_sutrisno',
                'password' => Hash::make('password'),
                'role' => 'author',
                'is_verified' => true,
                'status' => 'active',
                'institution' => 'Universitas Gadjah Mada',
                'expertise' => 'AI & Machine Learning',
            ]
        );

        $reviewer1 = User::firstOrCreate(
            ['email' => 'reviewer1@test.com'],
            [
                'name' => 'Dr. Siti Rahma',
                'username' => 'siti_rahma',
                'password' => Hash::make('password'),
                'role' => 'reviewer',
                'is_verified' => true,
                'status' => 'active',
                'institution' => 'Universitas Indonesia',
                'expertise' => 'NLP, AI, Data Science',
            ]
        );

        $reviewer2 = User::firstOrCreate(
            ['email' => 'reviewer2@test.com'],
            [
                'name' => 'Prof. Hendra Wijaya',
                'username' => 'hendra_wijaya',
                'password' => Hash::make('password'),
                'role' => 'reviewer',
                'is_verified' => true,
                'status' => 'active',
                'institution' => 'ITB',
                'expertise' => 'Machine Learning, Computer Vision',
            ]
        );

        $reviewer3 = User::firstOrCreate(
            ['email' => 'reviewer3@test.com'],
            [
                'name' => 'Dr. Andi Kurniawan',
                'username' => 'andi_kurniawan',
                'password' => Hash::make('password'),
                'role' => 'reviewer',
                'is_verified' => true,
                'status' => 'active',
                'institution' => 'Universitas Telkom',
                'expertise' => 'IoT, Embedded Systems',
            ]
        );

        $paper1 = Paper::firstOrCreate(
            [
                'user_id' => $author->id,
                'title' => 'Deteksi Anomali Jaringan dengan Graph Neural Networks',
            ],
            [
                'abstract' => 'Penelitian ini mengusulkan pendekatan berbasis Graph Neural Networks untuk mendeteksi anomali dalam jaringan komputer.',
                'track' => 'AI & Data Science',
                'similarity_score' => 44.0,
                'status' => 'under_review',
                'submitted_at' => now()->subDays(5),
            ]
        );

        $paper2 = Paper::firstOrCreate(
            [
                'user_id' => $author->id,
                'title' => 'Model Prediktif Retensi Mahasiswa berbasis Machine Learning',
            ],
            [
                'abstract' => 'Studi ini mengembangkan model machine learning untuk memprediksi retensi mahasiswa dan mengidentifikasi faktor-faktor kunci yang mempengaruhi keputusan mereka.',
                'track' => 'Pendidikan Digital',
                'similarity_score' => 8.0,
                'status' => 'accepted',
                'submitted_at' => now()->subDays(15),
            ]
        );

        PaperReview::firstOrCreate(
            [
                'paper_id' => $paper1->id,
                'reviewer_id' => $reviewer1->id,
            ],
            [
                'score' => 7,
                'comment' => 'Pendekatan bagus, namun perlu improvement di metodologi',
                'status' => 'pending',
            ]
        );

        PaperReview::firstOrCreate(
            [
                'paper_id' => $paper1->id,
                'reviewer_id' => $reviewer2->id,
            ],
            [
                'score' => 6,
                'comment' => 'Hasil eksperimen masih kurang convincing',
                'status' => 'pending',
            ]
        );

        PaperReview::firstOrCreate(
            [
                'paper_id' => $paper2->id,
                'reviewer_id' => $reviewer3->id,
            ],
            [
                'score' => 9,
                'comment' => 'Penelitian sangat menarik dan bermanfaat',
                'status' => 'completed',
                'submitted_at' => now()->subDays(10),
            ]
        );
    }
}

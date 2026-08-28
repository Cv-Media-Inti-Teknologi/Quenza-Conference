<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Mock data for Dashboard Super Admin (to be replaced with DB queries later)
        $metrics = [
            'tickets_sold' => [
                'value' => 742,
                'change' => '+15% vs bulan lalu',
                'trend' => 'up',
            ],
            'total_papers' => [
                'value' => 418,
                'label' => 'Total diajukan',
            ],
            'cash_in' => [
                'value' => 'Rp 134.564.000',
                'change' => '+12% vs bulan lalu',
                'trend' => 'up',
            ],
            'cash_out' => [
                'value' => 'Rp 112.000.000',
                'label' => 'Biaya operasional',
            ]
        ];

        $timeline = [
            ['phase' => 'Fase 1', 'title' => 'Ketersediaan', 'desc' => 'Ditutup: 10 Juli 2026', 'status' => 'completed'],
            ['phase' => 'Fase 2', 'title' => 'Review Naskah', 'desc' => 'Hingga 15 Ags 2026', 'status' => 'active', 'badge' => 'In Progress'],
            ['phase' => 'Fase 3', 'title' => 'Pembayaran', 'desc' => 'Mulai 1 Sep 2026', 'status' => 'upcoming'],
            ['phase' => 'Fase 4', 'title' => 'Pelaksanaan Event', 'desc' => '14-16 Okt 2026 (ICIT)', 'status' => 'upcoming'],
        ];

        $registrationTrend = [
            ['name' => 'Mei', 'pendaftar' => 120],
            ['name' => 'Jun', 'pendaftar' => 340],
            ['name' => 'Jul', 'pendaftar' => 520],
            ['name' => 'Ags', 'pendaftar' => 742],
        ];

        $paperStatus = [
            ['name' => 'Accepted', 'value' => 210, 'color' => '#10b981'],
            ['name' => 'Revision', 'value' => 105, 'color' => '#f59e0b'],
            ['name' => 'Review', 'value' => 63, 'color' => '#3b82f6'],
            ['name' => 'Rejected', 'value' => 40, 'color' => '#ef4444'],
        ];

        $financeMutations = [
            ['id' => 'TRX-2021', 'name' => 'Mark Ekosoebio', 'amount' => 'Rp 1.500.000', 'desc' => 'Registrasi Presenter', 'date' => '12/06/2026', 'status' => 'Paid'],
            ['id' => 'TRX-2022', 'name' => 'Willem K.', 'amount' => 'Rp 650.000', 'desc' => 'Registrasi Participant', 'date' => '22/05/2026', 'status' => 'Paid'],
            ['id' => 'TRX-2023', 'name' => 'Tirta Ayud', 'amount' => 'Rp 45.000.000', 'desc' => 'Sponsorship Gold', 'date' => '15/05/2026', 'status' => 'Process'],
            ['id' => 'TRX-2025', 'name' => 'Sanderson', 'amount' => 'Rp 12.000.000', 'desc' => 'Refund Ditolak', 'date' => '25/05/2026', 'status' => 'Cancelled'],
        ];

        $aiAlerts = [
            [
                'type' => 'REKOMENDASI',
                'title' => '3 reviewer relevan untuk paper #P-105',
                'desc' => 'Paper terkait IoT cocok dengan keahlian Dr. Santoso, Prof. Lili, dan Andi, M.Kom.'
            ],
            [
                'type' => 'PLAGIARISM',
                'title' => 'Similarity score 34% pada paper #P-204',
                'desc' => 'Melebihi ambang batas 30% - perlu perhatian evaluasi review lanjutan.'
            ],
            [
                'type' => 'DEADLINE',
                'title' => '6 naskah mendekati tenggat review',
                'desc' => 'H-1 untuk track Data Science. Pengingat otomatis terkirim ke reviewer.'
            ]
        ];

        $roomAssignments = [
            ['name' => 'Ruang Garuda', 'topic' => 'AI & Machine Learning', 'occupied' => 104, 'capacity' => 120, 'status' => 'normal'],
            ['name' => 'Ruang Kartika', 'topic' => 'Software Engineering', 'occupied' => 80, 'capacity' => 80, 'status' => 'full'],
            ['name' => 'Ruang Melati', 'topic' => 'Data Science', 'occupied' => 82, 'capacity' => 80, 'status' => 'over'],
            ['name' => 'Ruang Cendana', 'topic' => 'IoT & Embedded', 'occupied' => 74, 'capacity' => 100, 'status' => 'normal'],
        ];

        return Inertia::render('Dashboard', [
            'metrics' => $metrics,
            'timeline' => $timeline,
            'registrationTrend' => $registrationTrend,
            'paperStatus' => $paperStatus,
            'financeMutations' => $financeMutations,
            'aiAlerts' => $aiAlerts,
            'roomAssignments' => $roomAssignments,
        ]);
    }
}

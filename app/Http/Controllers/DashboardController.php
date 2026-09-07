<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Paper;
use App\Models\Room;
use App\Models\Transaction;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Format Currency Helper
        $formatCurrency = function ($amount) {
            return 'Rp '.number_format((float) $amount, 0, ',', '.');
        };

        // Real Database Queries
        $totalPapers = Paper::count();
        $ticketsSold = Transaction::where('type', 'registration')->where('status', 'paid')->count();

        $cashIn = Transaction::where('status', 'paid')->sum('amount');
        $cashOut = Expense::where('status', 'approved')->sum('amount');

        // Recent Finance Mutations (Last 5 transactions + expenses combined roughly)
        $recentTransactions = Transaction::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($t) use ($formatCurrency) {
                return [
                    'id' => $t->reference_code ?? 'TRX-'.$t->id,
                    'name' => $t->user->name ?? 'Unknown',
                    'amount' => $formatCurrency($t->amount),
                    'desc' => $t->description ?? 'Pemasukan',
                    'date' => $t->created_at->format('d/m/Y'),
                    'status' => $t->status === 'paid' ? 'Paid' : ucfirst($t->status),
                ];
            });

        // Room Assignments (Real data)
        $roomAssignments = Room::all()->map(function ($room) {
            return [
                'name' => $room->name,
                'topic' => $room->topic,
                'occupied' => 0, // Placeholder until schedule is fully tracked
                'capacity' => $room->capacity,
                'status' => 'normal',
            ];
        });

        // Paper Status Chart Data
        $paperStatus = [
            ['name' => 'Accepted', 'value' => Paper::where('status', 'accepted')->count(), 'color' => '#10b981'],
            ['name' => 'Revision', 'value' => Paper::where('status', 'revision')->count(), 'color' => '#f59e0b'],
            ['name' => 'Review', 'value' => Paper::where('status', 'under_review')->count(), 'color' => '#3b82f6'],
            ['name' => 'Rejected', 'value' => Paper::where('status', 'rejected')->count(), 'color' => '#ef4444'],
            ['name' => 'Submitted', 'value' => Paper::where('status', 'submitted')->count(), 'color' => '#94a3b8'],
        ];

        // Clean up empty status
        $paperStatus = array_values(array_filter($paperStatus, fn ($item) => $item['value'] > 0));
        if (empty($paperStatus)) {
            $paperStatus = [['name' => 'No Data', 'value' => 1, 'color' => '#e2e8f0']];
        }

        $metrics = [
            'tickets_sold' => [
                'value' => $ticketsSold,
                'change' => 'Real-time',
                'trend' => 'up',
            ],
            'total_papers' => [
                'value' => $totalPapers,
                'label' => 'Total diajukan',
            ],
            'cash_in' => [
                'value' => $formatCurrency($cashIn),
                'change' => 'Total Pendapatan',
                'trend' => 'up',
            ],
            'cash_out' => [
                'value' => $formatCurrency($cashOut),
                'label' => 'Total Pengeluaran',
            ],
        ];

        $timeline = [
            ['phase' => 'Fase 1', 'title' => 'Ketersediaan', 'desc' => 'Ditutup: 10 Juli 2026', 'status' => 'completed'],
            ['phase' => 'Fase 2', 'title' => 'Review Naskah', 'desc' => 'Hingga 15 Ags 2026', 'status' => 'active', 'badge' => 'In Progress'],
            ['phase' => 'Fase 3', 'title' => 'Pembayaran', 'desc' => 'Mulai 1 Sep 2026', 'status' => 'upcoming'],
            ['phase' => 'Fase 4', 'title' => 'Pelaksanaan Event', 'desc' => '14-16 Okt 2026', 'status' => 'upcoming'],
        ];

        $registrationTrend = [
            ['name' => 'Mei', 'pendaftar' => 120],
            ['name' => 'Jun', 'pendaftar' => 340],
            ['name' => 'Jul', 'pendaftar' => 520],
            ['name' => 'Ags', 'pendaftar' => 742],
        ];

        $aiAlerts = [
            [
                'type' => 'INFO',
                'title' => 'Sistem Terhubung',
                'desc' => 'Dashboard dan modul Keuangan kini terhubung ke database realtime.',
            ],
        ];

        return Inertia::render('Dashboard', [
            'metrics' => $metrics,
            'timeline' => $timeline,
            'registrationTrend' => $registrationTrend,
            'paperStatus' => $paperStatus,
            'financeMutations' => $recentTransactions,
            'aiAlerts' => $aiAlerts,
            'roomAssignments' => $roomAssignments,
        ]);
    }
}

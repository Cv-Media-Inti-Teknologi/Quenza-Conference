<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Refund;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index()
    {
        $metrics = $this->getMetricsData();

        return Inertia::render('Admin/Finance', [
            'initialMetrics' => $metrics,
        ]);
    }

    public function getMetrics(Request $request)
    {
        return response()->json($this->getMetricsData($request));
    }

    private function getMetricsData(?Request $request = null): array
    {
        $query = Transaction::where('status', 'paid');
        $expenseQuery = Expense::where('status', 'approved');

        if ($request?->query('startDate') || $request?->query('endDate')) {
            $startDate = $request?->query('startDate') ? Carbon::parse($request->query('startDate'))->startOfDay() : Carbon::now()->startOfMonth();
            $endDate = $request?->query('endDate') ? Carbon::parse($request->query('endDate'))->endOfDay() : Carbon::now()->endOfMonth();

            $query->whereBetween('paid_at', [$startDate, $endDate]);
            $expenseQuery->whereBetween('approved_at', [$startDate, $endDate]);
        }

        $grossIncome = $query->sum('amount');
        $totalExpense = $expenseQuery->sum('amount');
        $netBalance = $grossIncome - $totalExpense;

        return [
            'gross_income' => (int) $grossIncome,
            'total_expense' => (int) $totalExpense,
            'net_balance' => (int) $netBalance,
        ];
    }

    public function getTransactions(Request $request)
    {
        $query = Transaction::with('user');

        if ($request->has('type') && $request->query('type') !== 'all') {
            $query->where('type', $request->query('type'));
        }

        if ($request->has('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('startDate')) {
            $query->whereDate('created_at', '>=', $request->query('startDate'));
        }

        if ($request->has('endDate')) {
            $query->whereDate('created_at', '<=', $request->query('endDate'));
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($transactions);
    }

    public function createTransaction(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:registration,sponsorship,grant,other',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'reference_code' => 'nullable|string|unique:transactions',
        ]);

        $transaction = Transaction::create([
            ...$validated,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $transaction], 201);
    }

    public function deleteTransaction(Transaction $transaction)
    {
        $transaction->delete();

        return response()->json(['success' => true]);
    }

    public function getExpenses(Request $request)
    {
        $query = Expense::with(['createdBy', 'approvedBy']);

        if ($request->has('category') && $request->query('category') !== 'all') {
            $query->where('category', $request->query('category'));
        }

        if ($request->has('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('startDate')) {
            $query->whereDate('created_at', '>=', $request->query('startDate'));
        }

        if ($request->has('endDate')) {
            $query->whereDate('created_at', '<=', $request->query('endDate'));
        }

        $expenses = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($expenses);
    }

    public function createExpense(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'receipt_url' => 'nullable|string',
        ]);

        $expense = Expense::create([
            ...$validated,
            'status' => 'pending',
            'created_by' => auth()->id(),
        ]);

        return response()->json(['success' => true, 'data' => $expense], 201);
    }

    public function updateExpenseStatus(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $expense->update([
            'status' => $validated['status'],
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $expense]);
    }

    public function deleteExpense(Expense $expense)
    {
        $expense->delete();

        return response()->json(['success' => true]);
    }

    public function getRefunds(Request $request)
    {
        $query = Refund::with(['transaction', 'requestedBy', 'processedBy']);

        if ($request->has('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        $refunds = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($refunds);
    }

    public function requestRefund(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'reason' => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $transaction = Transaction::findOrFail($validated['transaction_id']);

        // Validasi: amount tidak boleh lebih dari saldo transaksi
        if ($validated['amount'] > $transaction->amount) {
            return response()->json([
                'success' => false,
                'message' => 'Jumlah refund tidak boleh lebih dari nominal transaksi.',
            ], 422);
        }

        $refund = Refund::create([
            'transaction_id' => $transaction->id,
            'reason' => $validated['reason'],
            'amount' => $validated['amount'],
            'status' => 'requested',
            'requested_by' => auth()->id(),
            'requested_at' => now(),
        ]);

        // Update status transaction jadi refunded (konsisten dengan TicketingController)
        $transaction->update([
            'status' => 'refunded',
            'refunded_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $refund], 201);
    }

    public function processRefund(Request $request, Refund $refund)
    {
        $validated = $request->validate([
            'status' => 'required|in:processed,completed,rejected',
            'notes' => 'nullable|string',
        ]);

        $refund->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'processed_by' => auth()->id(),
            'processed_at' => now(),
            'completed_at' => $validated['status'] === 'completed' ? now() : null,
        ]);

        return response()->json(['success' => true, 'data' => $refund]);
    }

    public function exportReport(Request $request)
    {
        $startDate = $request->query('startDate') ? Carbon::parse($request->query('startDate')) : Carbon::now()->startOfMonth();
        $endDate = $request->query('endDate') ? Carbon::parse($request->query('endDate')) : Carbon::now()->endOfMonth();
        $format = $request->query('format', 'pdf');

        $metrics = $this->getMetricsData($request);
        $transactions = Transaction::where('status', 'paid')
            ->whereBetween('paid_at', [$startDate, $endDate])
            ->get();
        $expenses = Expense::where('status', 'approved')
            ->whereBetween('approved_at', [$startDate, $endDate])
            ->get();

        $data = [
            'metrics' => $metrics,
            'transactions' => $transactions,
            'expenses' => $expenses,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ];

        if ($format === 'excel') {
            return $this->exportExcel($data);
        }

        return response()->json(['success' => true, 'data' => $data]);
    }

    private function exportExcel(array $data)
    {
        $filename = 'laporan-keuangan-'.Carbon::now()->format('Ymd_His').'.csv';

        $csv = fopen('php://temp', 'r+');

        // Header
        fputcsv($csv, ['No', 'Tipe', 'Deskripsi', 'Kategori / Status', 'Nominal (IDR)', 'Metode Pembayaran', 'Kode Referensi', 'Tanggal', 'User']);

        $no = 1;

        // Income - Transactions
        foreach ($data['transactions'] as $t) {
            fputcsv($csv, [
                $no++,
                'Pemasukan ('.$t->type.')',
                $t->description ?? '-',
                ucfirst($t->type),
                number_format((float) $t->amount, 0, ',', '.'),
                $t->payment_method ?? '-',
                $t->reference_code ?? '-',
                $t->paid_at ? $t->paid_at->format('d/m/Y H:i') : '-',
                $t->user?->name ?? '-',
            ]);
        }

        // Expense
        foreach ($data['expenses'] as $e) {
            fputcsv($csv, [
                $no++,
                'Pengeluaran ('.$e->category.')',
                $e->description ?? '-',
                ucfirst($e->category),
                '-'.number_format((float) $e->amount, 0, ',', '.'),
                '-', '-', '-',
                $e->createdBy?->name ?? '-',
            ]);
        }

        rewind($csv);
        $csvContent = stream_get_contents($csv);
        fclose($csv);

        return response()->streamDownload(
            fn() => echo $csvContent,
            $filename,
            ['Content-Type' => 'text/csv; charset=UTF-8']
        );
    }

    public function getFinanceChart(Request $request)
    {
        $months = 8;
        $incomeData = [];
        $expenseData = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i)->startOfMonth();
            $startDate = $date->copy()->startOfMonth()->toDateString();
            $endDate = $date->copy()->endOfMonth()->toDateString();

            $income = Transaction::where('status', 'paid')
                ->whereNotNull('paid_at')
                ->whereDate('paid_at', '>=', $startDate)
                ->whereDate('paid_at', '<=', $endDate)
                ->sum('amount');

            $expense = Expense::where('status', 'approved')
                ->whereNotNull('approved_at')
                ->whereDate('approved_at', '>=', $startDate)
                ->whereDate('approved_at', '<=', $endDate)
                ->sum('amount');

            $monthName = $date->format('M');

            $incomeData[] = [
                'name' => $monthName,
                'value' => (float) $income,
            ];

            $expenseData[] = [
                'name' => $monthName,
                'value' => (float) $expense,
            ];
        }

        return response()->json([
            'income' => $incomeData,
            'expense' => $expenseData,
        ]);
    }
}

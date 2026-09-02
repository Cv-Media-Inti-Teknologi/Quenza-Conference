<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\TicketPricing;
use App\Models\Transaction;
use App\Models\TransactionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketingController extends Controller
{
    public function index()
    {
        $ticketPricing = TicketPricing::all();
        $ticketList = Transaction::with('user')
            ->where('status', 'paid')
            ->orderBy('paid_at', 'desc')
            ->get();

        return Inertia::render('Admin/Ticketing', [
            'ticketPricing' => $ticketPricing,
            'ticketList' => $ticketList,
        ]);
    }

    public function getTicketPricing(Request $request)
    {
        $pricing = TicketPricing::all();

        return response()->json($pricing);
    }

    public function updateTicketPricing(Request $request)
    {
        $validated = $request->validate([
            'pricing' => 'required|array',
            'pricing.*.id' => 'required|exists:ticket_pricing,id',
            'pricing.*.regular_price' => 'required|numeric|min:0',
            'pricing.*.late_price' => 'nullable|numeric|min:0',
        ]);

        foreach ($validated['pricing'] as $item) {
            TicketPricing::find($item['id'])->update([
                'regular_price' => $item['regular_price'],
                'late_price' => $item['late_price'] ?? null,
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Harga tiket berhasil diperbarui']);
    }

    public function updateSingleTicketPrice(Request $request, TicketPricing $ticketPricing)
    {
        $validated = $request->validate([
            'regular_price' => 'required|numeric|min:0',
            'late_price' => 'nullable|numeric|min:0',
        ]);

        $ticketPricing->update($validated);

        return response()->json(['success' => true, 'data' => $ticketPricing]);
    }

    public function getTicketList(Request $request)
    {
        $query = Transaction::with('user')
            ->where('status', 'paid');

        if ($request->has('type') && $request->query('type') !== 'all') {
            $query->where('type', $request->query('type'));
        }

        $tickets = $query->orderBy('paid_at', 'desc')->paginate(10);

        return response()->json($tickets);
    }

    public function getTicketDetail(Request $request, Transaction $transaction)
    {
        $detail = $transaction->load('user');

        return response()->json($detail);
    }

    public function getTransactionLog(Request $request)
    {
        $query = TransactionLog::query();

        if ($request->has('category') && $request->query('category') !== 'all') {
            $query->where('category', $request->query('category'));
        }

        if ($request->has('type') && $request->query('type') !== 'all') {
            $query->where('type', $request->query('type'));
        }

        if ($request->has('startDate')) {
            $query->whereDate('transaction_date', '>=', $request->query('startDate'));
        }

        if ($request->has('endDate')) {
            $query->whereDate('transaction_date', '<=', $request->query('endDate'));
        }

        $logs = $query->orderBy('transaction_date', 'desc')->paginate(10);

        return response()->json($logs);
    }

    public function createTransactionLog(Request $request)
    {
        $validated = $request->validate([
            'transaction_name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'counterparty_name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'transaction_date' => 'required|date',
            'transaction_time' => 'nullable|date_format:H:i',
            'category' => 'required|string',
            'payment_method' => 'nullable|string',
            'description' => 'nullable|string',
            'receipt_url' => 'nullable|string',
        ]);

        $log = TransactionLog::create($validated);

        return response()->json(['success' => true, 'data' => $log], 201);
    }

    public function deleteTransactionLog(TransactionLog $log)
    {
        $log->delete();

        return response()->json(['success' => true]);
    }

    public function requestRefund(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'reason' => 'required|string',
            'amount' => 'required|numeric|min:0|max:'.$transaction->amount,
        ]);

        $refund = $transaction->refunds()->create([
            'reason' => $validated['reason'],
            'amount' => $validated['amount'],
            'status' => 'requested',
            'requested_by' => auth()->id(),
            'requested_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $refund], 201);
    }
}

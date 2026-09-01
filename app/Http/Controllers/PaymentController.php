<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TicketPricing;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Initiate payment for user (simulate payment process)
     * Used when user clicks "Bayar Sekarang" in frontend
     */
    public function initiatePayment(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:registration,sponsorship,grant',
            'payment_method' => 'nullable|string|in:transfer,virtual_account,qris,cash',
        ]);

        $user = auth()->user();

        // Get pricing based on type
        $price = 0;
        switch ($validated['type']) {
            case 'registration':
                $ticket = TicketPricing::where('category', 'participant')->first();
                $price = $ticket?->regular_price ?? 1500000;
                break;
            case 'sponsorship':
                $price = 5000000; // Default sponsorship price
                break;
            case 'grant':
                $price = 2000000; // Default grant price
                break;
        }

        // Create transaction with pending status
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => $validated['type'],
            'description' => 'Pembayaran ' . ucfirst($validated['type']),
            'amount' => $price,
            'status' => 'pending',
            'payment_method' => $validated['payment_method'] ?? 'transfer',
            'reference_code' => 'INV-' . strtoupper(substr(uniqid(), -8)),
            'expires_at' => now()->addDay(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $transaction,
            'message' => 'Payment initiated. Silakan selesaikan pembayaran melalui metode yang dipilih.',
        ], 201);
    }

    /**
     * Payment gateway webhook handler
     * Called by Midtrans/Xendit when payment status changes
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();

        // Basic validation
        $orderId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;

        if (!$orderId || !$transactionStatus) {
            return response()->json(['error' => 'Invalid webhook payload'], 400);
        }

        // Find transaction by reference_code or order_id
        $transaction = Transaction::where('reference_code', $orderId)
            ->orWhere('id', str_replace('INV-', '', $orderId))
            ->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        // Process based on transaction status
        $transaction->update([
            'status' => $this->mapPaymentStatus($transactionStatus),
            'paid_at' => in_array($transactionStatus, ['settlement', 'capture', 'pending']) ? now() : null,
        ]);

        // If payment successful and type is registration, update user verification status
        if ($transaction->status === 'paid' && $transaction->type === 'registration') {
            $transaction->user->update([
                'is_verified' => true,
                'status' => 'active',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated',
            'transaction' => $transaction,
        ]);
    }

    /**
     * Map payment gateway status to local status
     */
    private function mapPaymentStatus($gatewayStatus)
    {
        $map = [
            'settlement' => 'paid',
            'capture' => 'paid',
            'pending' => 'pending',
            'expire' => 'expired',
            'cancel' => 'cancelled',
            'deny' => 'cancelled',
        ];

        return $map[$gatewayStatus] ?? 'pending';
    }

    /**
     * Create expense manually (for admin)
     */
    public function createExpense(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|in:venue,hotel,honor,catering,online,ticket,sponsor,other',
            'description' => 'required|string|max:500',
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

    /**
     * Simulate quick payment for testing
     * Marks transaction as paid immediately without actual payment
     */
    public function markAsPaid(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
        ]);

        $transaction = Transaction::findOrFail($validated['transaction_id']);

        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Update user status for registration transactions
        if ($transaction->type === 'registration') {
            $transaction->user->update([
                'is_verified' => true,
                'status' => 'active',
            ]);
        }

        return response()->json(['success' => true, 'data' => $transaction]);
    }
}

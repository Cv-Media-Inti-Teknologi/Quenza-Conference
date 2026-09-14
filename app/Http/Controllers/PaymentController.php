<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\TicketPricing;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Kategori harga yang valid untuk pembelian registrasi.
     */
    private const REGISTRATION_CATEGORIES = [
        'participant',
        'student',
        'author',
        'presiden',
        'participant_online',
        'student_online',
        'international_participant',
        'international_author',
        'international_participant_online',
    ];

    /**
     * Initiate payment for user (simulate payment process)
     * Used when user clicks "Bayar Sekarang" in frontend
     */
    public function initiatePayment(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:registration,sponsorship,grant',
            'category' => 'nullable|string',
            'payment_method' => 'nullable|string|in:transfer,virtual_account,qris,cash',
        ]);

        $user = auth()->user();

        // Get pricing based on type
        $price = 0;
        $currency = 'IDR';
        $categoryLabel = null;
        $category = null;
        switch ($validated['type']) {
            case 'registration':
                // Kategori yang dipilih user di halaman payment (divalidasi ke DB,
                // fallback ke participant kalau kategori tidak dikenal)
                $category = in_array($validated['category'] ?? '', self::REGISTRATION_CATEGORIES, true)
                    ? $validated['category']
                    : 'participant';

                $ticket = TicketPricing::where('category', $category)->first();
                $price = (float) ($ticket?->regular_price ?? 1500000);
                $currency = $ticket?->currency ?? 'IDR';
                $categoryLabel = $ticket?->label;

                // Paket presenter/author mempromosikan user ke role author saat lunas,
                // supaya bisa submit paper (alur PRD: bayar → verified → submit).
                $authorCategories = ['author', 'presiden', 'international_author'];

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
            'description' => $categoryLabel
                ? 'Pembayaran '.ucfirst($validated['type']).' — '.$categoryLabel
                : 'Pembayaran '.ucfirst($validated['type']),
            'amount' => $price,
            'currency' => $currency,
            'status' => 'pending',
            'payment_method' => $validated['payment_method'] ?? 'transfer',
            'reference_code' => 'INV-'.strtoupper(substr(uniqid(), -8)),
            'expires_at' => now()->addDay(),
            // Simpan kategori paket (author/presiden → upgrade ke author saat lunas)
            'category' => $category,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $transaction,
                'message' => 'Payment initiated. Silakan selesaikan pembayaran melalui metode yang dipilih.',
            ], 201);
        }

        // Flow web: langsung arahkan ke halaman instruksi pembayaran
        return redirect()->route('payment.waiting', ['transaction' => $transaction->id]);
    }

    /**
     * Halaman instruksi / status pembayaran untuk transaksi milik user.
     */
    public function waiting(Request $request, Transaction $transaction): Response
    {
        abort_unless($transaction->user_id === $request->user()->id, 404);

        return Inertia::render('Payment/PaymentWaiting', [
            'transaction' => [
                'id' => $transaction->id,
                'reference_code' => $transaction->reference_code,
                'type' => $transaction->type,
                'description' => $transaction->description,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->currency ?? 'IDR',
                'status' => $transaction->status,
                'payment_method' => $transaction->payment_method,
                'expires_at' => $transaction->expires_at?->format('d/m/Y H:i'),
                'paid_at' => $transaction->paid_at?->format('d/m/Y H:i'),
                'user_name' => $transaction->user?->name,
            ],
        ]);
    }

    /**
     * Simulasi konfirmasi pembayaran oleh user (untuk development).
     * Di production, status 'paid' hanya boleh di-set via webhook gateway.
     */
    public function confirmSelfPaid(Request $request, Transaction $transaction): RedirectResponse
    {
        abort_unless($transaction->user_id === $request->user()->id, 404);

        if ($transaction->status !== 'pending') {
            return redirect()
                ->route('payment.waiting', ['transaction' => $transaction->id])
                ->with('error', 'Transaksi ini sudah diproses dan tidak bisa dikonfirmasi ulang.');
        }

        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        if ($transaction->type === 'registration') {
            $transaction->user->update([
                'is_verified' => true,
                'status' => 'active',
            ]);
            $this->applyRegistrationPerks($transaction);
        }

        return redirect()
            ->route('payment.waiting', ['transaction' => $transaction->id])
            ->with('success', 'Pembayaran berhasil dikonfirmasi. Terima kasih!');
    }

    /**
     * Terapkan manfaat registrasi sesuai kategori paket yang dibeli:
     * - Paket presenter/author → user dipromosikan ke role author (bisa submit paper).
     * Dipanggil dari confirmSelfPaid dan handleWebhook.
     */
    private function applyRegistrationPerks(Transaction $transaction): void
    {
        $authorCategories = ['author', 'presiden', 'international_author'];

        if (in_array($transaction->category, $authorCategories, true)
            && $transaction->user->role === 'participant') {
            $transaction->user->update(['role' => 'author']);
        }
    }

    /**
     * Payment gateway webhook handler
     * Called by Midtrans (format payload Midtrans) when payment status changes.
     *
     * Keamanan:
     * 1. Verifikasi HMAC-SHA512 signature_key Midtrans:
     *    sha512(order_id + status_code + gross_amount + serverKey)
     * 2. (Opsional) whitelist IP gateway via config/payment.php.
     * 3. Idempotent: status tidak akan di-downgrade (paid → pending dsb).
     */
    public function handleWebhook(Request $request)
    {
        // 0. Opsional: whitelist IP gateway (config/payment.php)
        $allowedIps = config('payment.midtrans.webhook_allowed_ips', []);
        if (! empty($allowedIps) && ! in_array($request->ip(), $allowedIps, true)) {
            return response()->json(['error' => 'Forbidden IP'], 403);
        }

        $payload = $request->all();

        $orderId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;

        if (! $orderId || ! $transactionStatus) {
            return response()->json(['error' => 'Invalid webhook payload'], 400);
        }

        // 1. Verifikasi signature (HMAC-SHA512 ala Midtrans)
        if (! $this->verifyWebhookSignature($orderId, $statusCode, $grossAmount, $signatureKey)) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        // 2. Verifikasi nominal: gross_amount gateway harus sama dengan amount transaksi
        $transaction = Transaction::where('reference_code', $orderId)
            ->orWhere('id', str_replace('INV-', '', $orderId))
            ->first();

        if (! $transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        $expectedAmount = number_format((float) $transaction->amount, 2, '.', '');
        $receivedAmount = number_format((float) str_replace([' IDR', '.00'], '', (string) $grossAmount), 2, '.', '');

        if ($grossAmount !== null && $receivedAmount !== $expectedAmount) {
            return response()->json(['error' => 'Amount mismatch'], 400);
        }

        $newStatus = $this->mapPaymentStatus($transactionStatus);

        // 3. Idempotency: jangan downgrade status yang sudah final
        $finalStatuses = ['paid', 'refunded'];
        if (in_array($transaction->status, $finalStatuses, true) && $newStatus !== 'refunded') {
            return response()->json([
                'success' => true,
                'message' => 'Transaction already in final state, ignored.',
                'transaction' => $transaction,
            ]);
        }

        // Process based on transaction status
        $transaction->update([
            'status' => $newStatus,
            'paid_at' => in_array($transactionStatus, ['settlement', 'capture']) ? now() : $transaction->paid_at,
        ]);

        // If payment successful and type is registration, update user verification status
        if ($transaction->status === 'paid' && $transaction->type === 'registration') {
            $transaction->user->update([
                'is_verified' => true,
                'status' => 'active',
            ]);
            $this->applyRegistrationPerks($transaction);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated',
            'transaction' => $transaction,
        ]);
    }

    /**
     * Verifikasi signature webhook Midtrans:
     * signature_key = sha512(order_id + status_code + gross_amount + server_key)
     *
     * Kalau PAYMENT_SERVER_KEY belum diset (development), verifikasi dilewati
     * supaya simulasi webhook lokal tetap bisa jalan.
     */
    private function verifyWebhookSignature(
        ?string $orderId,
        ?string $statusCode,
        ?string $grossAmount,
        ?string $signatureKey
    ): bool {
        $serverKey = config('payment.midtrans.server_key') ?? env('PAYMENT_SERVER_KEY');

        // Development: belum ada server key → skip verifikasi (log warning)
        if (empty($serverKey)) {
            if (! app()->environment('production')) {
                return true;
            }

            // Production wajib punya server key
            return false;
        }

        if (! $signatureKey || ! $orderId) {
            return false;
        }

        $expected = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        return hash_equals($expected, $signatureKey);
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
     * Admin menandai transaksi sebagai lunas (konfirmasi transfer manual / tunai).
     * Hanya untuk transaksi pending/expired; idempotent untuk status paid.
     */
    public function markAsPaid(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
        ]);

        $transaction = Transaction::with('user')->findOrFail($validated['transaction_id']);

        if ($transaction->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi ini sudah lunas.',
            ], 422);
        }

        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Konsisten dengan konfirmasi user & webhook: verified + upgrade role author
        if ($transaction->type === 'registration') {
            $transaction->user->update([
                'is_verified' => true,
                'status' => 'active',
            ]);
            $this->applyRegistrationPerks($transaction);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi '.$transaction->reference_code.' ditandai lunas.',
            'data' => $transaction,
        ]);
    }
}

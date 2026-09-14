<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\TicketPricing;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    /**
     * Tampilkan halaman my tickets untuk participant.
     */
    public function index(Request $request): Response
    {
        // Bisa diakses oleh semua role yang login
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->with('user')
            ->orderBy('paid_at', 'desc')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'reference_code' => $t->reference_code,
                'type' => $t->type,
                'amount' => (float) $t->amount,
                'currency' => $t->currency ?? 'IDR',
                'status' => $t->status,
                'payment_method' => $t->payment_method,
                'paid_at' => $t->paid_at?->toISOString(),
                'user' => [
                    'name' => $t->user?->name,
                ],
            ]);

        $ticketPricing = TicketPricing::all();

        return Inertia::render('Participant/MyTickets', [
            'transactions' => $transactions,
            'ticketPricing' => $ticketPricing,
        ]);
    }

    /**
     * Halaman E-Ticket (bisa dicetak/disimpan PDF oleh user).
     */
    public function receipt(Request $request, Transaction $transaction): Response
    {
        // Hanya pemilik transaksi yang boleh melihat tiketnya
        abort_unless($transaction->user_id === $request->user()->id, 403);

        $transaction->load('user');

        $conference = \App\Models\LandingContent::query()->first();

        return Inertia::render('Payment/TicketReceipt', [
            'transaction' => [
                'id' => $transaction->id,
                'reference_code' => $transaction->reference_code,
                'type' => $transaction->type,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->currency ?? 'IDR',
                'status' => $transaction->status,
                'payment_method' => $transaction->payment_method,
                'paid_at' => $transaction->paid_at?->toISOString(),
                'user' => [
                    'name' => $transaction->user?->name,
                    'email' => $transaction->user?->email,
                ],
            ],
            'conference' => $conference ? [
                'title' => $conference->conference_title,
                'date_range' => $conference->date_range,
                'location' => $conference->location,
            ] : null,
        ]);
    }
}

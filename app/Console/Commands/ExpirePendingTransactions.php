<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

class ExpirePendingTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transactions:expire-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ubah status transaksi pending yang melewati expires_at (24 jam) menjadi expired';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Mengecek transaksi pending yang sudah lewat batas waktu...');

        $expiredCount = Transaction::where('status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->update([
                'status' => 'expired',
            ]);

        if ($expiredCount === 0) {
            $this->info('Tidak ada transaksi yang expired.');
        } else {
            $this->info("{$expiredCount} transaksi diubah menjadi expired.");
        }

        return self::SUCCESS;
    }
}

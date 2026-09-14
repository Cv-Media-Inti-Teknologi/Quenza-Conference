<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

Schedule::command('ai:send-reminders')->dailyAt('08:00');

// Auto-expire transaksi pending yang lewat 24 jam (sesuai PRD)
Schedule::command('transactions:expire-pending')->everyFifteenMinutes();

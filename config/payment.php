<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Payment Gateway (Midtrans) Configuration
    |--------------------------------------------------------------------------
    |
    | Set credentials via environment variables. Jika server_key kosong,
    | verifikasi signature webhook dilewati di environment non-production
    | (untuk simulasi lokal), tapi WAJIB di production.
    |
    */

    'midtrans' => [
        'server_key' => env('PAYMENT_SERVER_KEY'),
        'client_key' => env('PAYMENT_CLIENT_KEY'),
        'is_production' => env('PAYMENT_IS_PRODUCTION', false),

        // Opsional: whitelist IP notifikasi Midtrans.
        // Kosongkan array = tidak ada pengecekan IP.
        'webhook_allowed_ips' => [
            // '103.208.14.66', contoh IP notifikasi Midtrans
        ],
    ],
];

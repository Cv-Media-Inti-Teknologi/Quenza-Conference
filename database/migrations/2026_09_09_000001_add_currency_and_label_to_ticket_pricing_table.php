<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom currency & label ke ticket_pricing untuk mendukung
     * kategori international (USD) dan label tampilan yang konsisten.
     */
    public function up(): void
    {
        Schema::table('ticket_pricing', function (Blueprint $table): void {
            $table->string('currency', 3)->default('IDR')->after('late_price');
            $table->string('label')->nullable()->after('currency');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_pricing', function (Blueprint $table): void {
            $table->dropColumn(['currency', 'label']);
        });
    }
};

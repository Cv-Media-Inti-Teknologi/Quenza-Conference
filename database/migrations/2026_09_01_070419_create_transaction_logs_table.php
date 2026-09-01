<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaction_logs', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_name');
            $table->decimal('amount', 12, 2);
            $table->string('counterparty_name');
            $table->string('type'); // income, expense
            $table->date('transaction_date');
            $table->time('transaction_time')->nullable();
            $table->string('category'); // online, hotel, venue, tiket_presenter, hibah_kampus, sponsor, other
            $table->string('payment_method')->nullable();
            $table->text('description')->nullable();
            $table->string('receipt_url')->nullable();
            $table->timestamps();

            $table->index('category');
            $table->index('type');
            $table->index('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_logs');
    }
};

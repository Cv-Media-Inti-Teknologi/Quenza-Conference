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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('type'); // registration, sponsorship, grant, other
            $table->text('description')->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('status')->default('pending'); // pending, paid, expired, cancelled
            $table->string('payment_method')->nullable(); // virtual_account, qris, transfer, cash
            $table->string('payment_proof_url')->nullable();
            $table->string('invoice_url')->nullable();
            $table->string('reference_code')->unique()->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

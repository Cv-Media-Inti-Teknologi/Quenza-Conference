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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // venue, hotel, honor, catering, online, ticket, sponsor, other
            $table->text('description');
            $table->decimal('amount', 12, 2);
            $table->string('receipt_url')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();

            $table->index('category');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};

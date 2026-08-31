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
        Schema::create('paper_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewer_id')->constrained('users')->cascadeOnDelete();
            $table->integer('score')->nullable();
            $table->text('comment')->nullable();
            $table->string('status', 50)->default('pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index('paper_id');
            $table->index('reviewer_id');
            $table->index('status');
            $table->unique(['paper_id', 'reviewer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_reviews');
    }
};

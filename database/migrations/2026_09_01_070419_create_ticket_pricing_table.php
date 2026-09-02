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
        Schema::create('ticket_pricing', function (Blueprint $table) {
            $table->id();
            $table->string('category')->unique(); // presiden, participant, author, etc
            $table->decimal('regular_price', 12, 2);
            $table->decimal('late_price', 12, 2)->nullable();
            $table->timestamps();

            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_pricing');
    }
};

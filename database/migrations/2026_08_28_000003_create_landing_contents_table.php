<?php

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
        Schema::create('landing_contents', function (Blueprint $table) {
            $table->id();
            $table->string('conference_title')->default('International Conference on Information Technology 2026');
            $table->string('conference_theme')->default('AI for a Sustainable Future');
            $table->text('description')->nullable();
            $table->string('date_range')->default('14–15 Okt 2026');
            $table->string('edition')->default('Edisi ke-8');
            $table->string('location')->default('Grand Ballroom, Bali (Hybrid)');
            $table->text('slider_images')->nullable();
            $table->text('speakers')->nullable();
            $table->text('important_dates')->nullable();
            $table->text('sponsors')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_contents');
    }
};

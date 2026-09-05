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
        Schema::table('event_settings', function (Blueprint $table): void {
            if (! Schema::hasColumn('event_settings', 'presenter_count')) {
                $table->integer('presenter_count')->default(0)->nullable()->after('presentation_duration_minutes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_settings', function (Blueprint $table): void {
            if (Schema::hasColumn('event_settings', 'presenter_count')) {
                $table->dropColumn('presenter_count');
            }
        });
    }
};

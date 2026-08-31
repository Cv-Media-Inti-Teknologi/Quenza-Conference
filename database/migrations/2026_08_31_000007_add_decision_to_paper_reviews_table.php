<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paper_reviews', function (Blueprint $table) {
            $table->string('decision', 50)->nullable()->after('comment');
        });
    }

    public function down(): void
    {
        Schema::table('paper_reviews', function (Blueprint $table) {
            $table->dropColumn('decision');
        });
    }
};

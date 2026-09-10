<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom file upload ke tabel papers:
     * - file_path: path file di storage (storage/app/private/papers)
     * - file_name: nama asli file saat diupload (untuk download)
     * - file_size: ukuran file dalam KB
     */
    public function up(): void
    {
        Schema::table('papers', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('full_text');
            $table->string('file_name')->nullable()->after('file_path');
            $table->unsignedInteger('file_size')->nullable()->after('file_name')->comment('Ukuran KB');
        });
    }

    public function down(): void
    {
        Schema::table('papers', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_name', 'file_size']);
        });
    }
};

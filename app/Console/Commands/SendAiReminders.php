<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Services\AiNotificationService;
use App\Mail\SmartNotificationMail;
use Carbon\Carbon;

class SendAiReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Otomatis mengecek deadline H-1 dan menyuruh AI membuat+mengirim email pengingat';

    /**
     * Execute the console command.
     */
    public function handle(AiNotificationService $aiService)
    {
        $this->info('Memulai pengecekan naskah yang mendekati deadline (H-1)...');

        // Cari semua review yang berstatus pending dan deadline_date = BESOK
        $tomorrow = Carbon::tomorrow()->toDateString();
        
        // DUMMY QUERY: Karena ini sistem demo, kita pura-pura temukan 1 data jika tabel kosong
        $pendingReviews = DB::table('paper_reviews')
            ->join('papers', 'paper_reviews.paper_id', '=', 'papers.id')
            ->join('users', 'paper_reviews.reviewer_id', '=', 'users.id')
            ->where('paper_reviews.status', 'pending')
            ->where('paper_reviews.deadline_date', $tomorrow)
            ->select('papers.title as paper_title', 'users.name as reviewer_name', 'users.email', 'paper_reviews.deadline_date')
            ->get();

        // Jika DB kosong, kita buat 1 data palsu agar cron job bisa di-demo-kan
        if ($pendingReviews->isEmpty()) {
            $this->info('Tidak ada jadwal real di DB. Menggunakan 1 data dummy untuk demo otomatisasi.');
            $pendingReviews = collect([(object)[
                'paper_title' => 'Analisis Machine Learning pada Keamanan Cyber',
                'reviewer_name' => 'Dr. Budi Santoso',
                'email' => 'budi@quenza.id',
                'deadline_date' => Carbon::tomorrow()->format('d F Y')
            ]]);
        }

        $sentCount = 0;

        foreach ($pendingReviews as $review) {
            $this->info("Meminta AI membuat draf untuk {$review->reviewer_name}...");
            
            // 1. Generate draf dengan AI
            $data = [
                'reviewer_name' => $review->reviewer_name,
                'paper_title' => $review->paper_title,
                'deadline_date' => $review->deadline_date,
                'current_date' => now()->format('d F Y'),
                'conference_name' => 'Quenza International Conference',
            ];
            
            $draft = $aiService->generateReminderDraft($data);

            // 2. Kirim email
            $this->info("Mengirim email ke {$review->email}...");
            Mail::to($review->email)->send(
                new SmartNotificationMail($draft['subject'], $draft['body'])
            );
            
            $sentCount++;
            $this->info("Berhasil dikirim!");
        }

        $this->info("Cron job selesai. Total {$sentCount} pengingat AI terkirim.");
        Log::info("Cron job ai:send-reminders selesai mengeksekusi {$sentCount} email.");
    }
}

<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Schedule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendSchedulePublishNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $schedules = Schedule::with(['paper.author', 'room'])->where('is_locked', true)->get();

        Log::info('Dispatching mass schedule notification emails for ' . $schedules->count() . ' sessions.');

        foreach ($schedules as $schedule) {
            $paper = $schedule->paper;
            $author = $paper?->author;

            if ($author && $author->email) {
                // In production, Mail::to($author->email)->send(new SchedulePublishedMail($schedule));
                Log::info("Queued schedule notification email to {$author->email} ({$author->name}) for paper [{$paper->paper_code}] {$paper->title} in {$schedule->room->name}");
            }
        }
    }
}

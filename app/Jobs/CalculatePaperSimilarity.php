<?php

namespace App\Jobs;

use App\Models\Paper;
use App\Services\AiSimilarityService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CalculatePaperSimilarity implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $paper;

    /**
     * Create a new job instance.
     */
    public function __construct(Paper $paper)
    {
        $this->paper = $paper;
    }

    /**
     * Execute the job.
     */
    public function handle(AiSimilarityService $similarityService): void
    {
        // 1. Generate Vector
        if (! $this->paper->embedding) {
            $vector = $similarityService->generateEmbedding($this->paper->abstract);
            $this->paper->embedding = json_encode($vector);
            $this->paper->save();
        } else {
            $vector = json_decode($this->paper->embedding, true);
        }

        if (! is_array($vector)) {
            return;
        }

        // 2. Bandingkan dengan paper lain
        $otherPapers = Paper::where('id', '!=', $this->paper->id)
            ->whereNotNull('embedding')
            ->get();

        $highestScore = 0;
        foreach ($otherPapers as $other) {
            $otherVector = json_decode($other->embedding, true);
            if (! is_array($otherVector)) {
                continue;
            }

            $score = $similarityService->calculateCosineSimilarity($vector, $otherVector);

            if ($score > $highestScore) {
                $highestScore = $score;
            }
        }

        // 3. Simpan
        $this->paper->similarity_score = $highestScore;
        $this->paper->save();
    }
}

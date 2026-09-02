<?php

namespace App\Observers;

use App\Jobs\CalculatePaperSimilarity;
use App\Models\Paper;

class PaperObserver
{
    /**
     * Handle the Paper "created" event.
     */
    public function created(Paper $paper): void
    {
        // Berdasarkan SRS: "AI deteksi similarity saat upload"
        // Kita masukan ke background job (queue) agar upload terasa instan
        CalculatePaperSimilarity::dispatch($paper);
    }
}

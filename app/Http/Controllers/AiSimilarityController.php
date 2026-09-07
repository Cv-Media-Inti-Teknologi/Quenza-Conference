<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Services\AiSimilarityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiSimilarityController extends Controller
{
    /**
     * Memeriksa skor similarity sebuah paper terhadap semua paper lain di database
     */
    public function checkSimilarity(Request $request, AiSimilarityService $similarityService): JsonResponse
    {
        $request->validate([
            'paper_id' => 'required|exists:papers,id',
        ]);

        $targetPaper = Paper::find($request->paper_id);

        // 1. Dapatkan Vektor untuk Paper Target
        if (! $targetPaper->embedding) {
            // Jika belum punya embedding, generate sekarang
            $vector = $similarityService->generateEmbedding($targetPaper->abstract);
            $targetPaper->embedding = json_encode($vector);
            $targetPaper->save();
        } else {
            $vector = json_decode($targetPaper->embedding, true);
        }

        // 2. Bandingkan dengan paper lain di database
        $otherPapers = Paper::where('id', '!=', $targetPaper->id)
            ->whereNotNull('embedding')
            ->get();

        $highestScore = 0;
        $highestMatchId = null;

        foreach ($otherPapers as $other) {
            $otherVector = json_decode($other->embedding, true);
            if (! is_array($otherVector)) {
                continue;
            }

            $score = $similarityService->calculateCosineSimilarity($vector, $otherVector);

            if ($score > $highestScore) {
                $highestScore = $score;
                $highestMatchId = $other->id;
            }
        }

        // Simpan skor tertinggi ke database (sebagai cache)
        $targetPaper->similarity_score = $highestScore;
        $targetPaper->save();

        // 3. Kembalikan hasil
        return response()->json([
            'status' => 'success',
            'similarity_score' => $highestScore,
            'highest_match_paper_id' => $highestMatchId,
            'message' => $highestScore > 30
                ? 'Peringatan: Tingkat kesamaan tinggi terdeteksi!'
                : 'Aman: Naskah lolos uji kemiripan internal.',
        ]);
    }
}

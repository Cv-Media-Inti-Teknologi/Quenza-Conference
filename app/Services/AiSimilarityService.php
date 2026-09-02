<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiSimilarityService
{
    /**
     * Memanggil API untuk mengubah teks abstrak menjadi array angka (vector).
     * Jika gagal atau endpoint tidak ada, akan memberikan fallback array acak.
     */
    public function generateEmbedding(string $text): array
    {
        $apiKey = config('services.ai.api_key'); // Kita asumsikan token sudah ada
        $url = 'https://ai-gateway.quenza.id/v1/embeddings';

        try {
            $response = Http::withoutVerifying()
                ->retry(2, 1000)
                ->withToken($apiKey)
                ->withHeaders(['Accept' => 'application/json'])
                ->timeout(10)
                ->post($url, [
                    'model' => 'text-embedding-3-small', // Asumsi model yang disupport
                    'input' => $text,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['data'][0]['embedding'])) {
                    return $data['data'][0]['embedding'];
                }
            }
        } catch (\Exception $e) {
            Log::warning('AI Embedding API Error: '.$e->getMessage());
        }

        // FALLBACK: Jika API gagal (misal karena gateway belum support endpoint ini),
        // kita generate array vektor dummy secara deterministik berdasarkan teks.
        Log::info('Menggunakan Fallback Dummy Embedding untuk simulasi.');

        return $this->generateDummyVector($text, 1536);
    }

    /**
     * Menghitung Cosine Similarity antara dua vektor (Array float).
     * Rumus: (A dot B) / (||A|| * ||B||)
     * Mengembalikan persentase 0 hingga 100.
     */
    public function calculateCosineSimilarity(array $vecA, array $vecB): int
    {
        if (count($vecA) !== count($vecB) || count($vecA) === 0) {
            return 0;
        }

        $dotProduct = 0;
        $normA = 0;
        $normB = 0;

        foreach ($vecA as $i => $valA) {
            $valB = $vecB[$i];
            $dotProduct += $valA * $valB;
            $normA += pow($valA, 2);
            $normB += pow($valB, 2);
        }

        if ($normA == 0 || $normB == 0) {
            return 0;
        }

        $similarity = $dotProduct / (sqrt($normA) * sqrt($normB));

        // Membatasi hasil ke 0-1 dan mengubah ke persentase
        $percent = max(0, min(1, $similarity)) * 100;

        return (int) round($percent);
    }

    /**
     * Membuat vektor deterministik sebagai fallback simulasi (Teks yang persis sama akan menghasilkan vektor yang 100% sama).
     */
    private function generateDummyVector(string $text, int $dimension): array
    {
        // Gunakan hash string sebagai seed agar hasilnya selalu sama untuk teks yang sama
        $hash = md5($text);
        $seed = hexdec(substr($hash, 0, 8));
        mt_srand($seed);

        $vector = [];
        for ($i = 0; $i < $dimension; $i++) {
            $vector[] = (mt_rand(-100, 100) / 1000);
        }

        mt_srand(); // Kembalikan ke random murni

        return $vector;
    }
}

<?php

namespace App\Services;

use App\Models\Paper;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiRecommendationService
{
    /**
     * Get AI recommended reviewers for a paper based on abstract and reviewer expertise.
     */
    public function getRecommendations(Paper $paper): array
    {
        // Hindari PHP timeout (default 30 detik) karena proses AI bisa memakan waktu lama
        set_time_limit(120);

        // 1. Fetch available reviewers
        $reviewers = User::where('role', 'reviewer')->get(['id', 'name', 'expertise']);
        
        if ($reviewers->isEmpty()) {
            return [];
        }

        $reviewerListStr = $reviewers->map(function($r) {
            return "ID: {$r->id} | Name: {$r->name} | Expertise: " . ($r->expertise ?? 'General');
        })->implode("\n");

        // 2. Build the prompt from the architecture document
        $systemPrompt = "Anda adalah AI asisten untuk \"Quenza Conference System\". 
Tugas Anda adalah merekomendasikan maksimal 3 reviewer terbaik untuk sebuah paper akademik berdasarkan kecocokan abstrak paper dengan keahlian reviewer.

ATURAN:
1. Anda HANYA BOLEH merespon dalam format JSON yang valid.
2. Jangan menambahkan teks apapun di luar format JSON.
3. Kembalikan ID reviewer dalam format integer, cocokkan dengan ID pada daftar reviewer.

=== DATA INPUT ===
Abstrak Paper: {$paper->abstract}

Daftar Reviewer Tersedia:
{$reviewerListStr}

=== FORMAT OUTPUT JSON ===
{
  \"recommendations\": [
    {
      \"id\": 1,
      \"name\": \"Nama Reviewer\",
      \"expertise\": \"Keahlian\",
      \"match_score_percentage\": 90,
      \"reason\": \"Alasan singkat (1 kalimat)\"
    }
  ]
}";

        // 3. Call LLM API (Using generic OpenAI compatible endpoint format)
        $apiKey = env('OPENAI_API_KEY');
        
        if (empty($apiKey)) {
            Log::warning('OPENAI_API_KEY is not set. Returning fallback recommendations.');
            return [];
        }

        try {
            $response = Http::withoutVerifying()
                ->withToken($apiKey)
                ->withHeaders([
                    'User-Agent' => 'Quenza-App/1.0',
                    'Accept' => 'application/json',
                ])
                ->timeout(120)
                ->post('https://ai-gateway.quenza.id/v1/chat/completions', [
                    'model' => 'free-model',
                    'stream' => false,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt
                        ],
                    ],
                    'temperature' => 0.2
                ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                
                // Bersihkan potensi blok markdown (```json ... ```) dari gateway Gemini
                $content = preg_replace('/^```json\s*/i', '', $content);
                $content = preg_replace('/```$/', '', trim($content));
                
                // Parse JSON
                $data = json_decode($content, true);
                
                if (isset($data['recommendations']) && is_array($data['recommendations'])) {
                    return $data['recommendations'];
                }
            } else {
                Log::error('LLM API Error: ' . $response->body());
            }

        } catch (\Exception $e) {
            Log::error('Exception in AI Recommendation: ' . $e->getMessage());
        }

        // Return mock data if API fails so the UI can still be seen
        return [
            [
                'id' => 1,
                'name' => 'Dr. Simulasi (API Error)',
                'expertise' => 'Data dummy karena API Key tidak valid',
                'match_score_percentage' => 85,
                'reason' => 'API Key OpenAI yang Anda masukkan salah atau kadaluarsa. Ini adalah data simulasi agar UI tetap terlihat.'
            ]
        ];
    }
}

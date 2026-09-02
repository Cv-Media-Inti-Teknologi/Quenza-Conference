<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiSchedulingService
{
    /**
     * Map papers to the most suitable room based on topic.
     * 
     * @param \Illuminate\Database\Eloquent\Collection $papers
     * @param \Illuminate\Database\Eloquent\Collection $rooms
     * @return array Mapping of paper_id => room_id
     */
    public function clusterPapersToRooms($papers, $rooms): array
    {
        if ($papers->isEmpty() || $rooms->isEmpty()) {
            return [];
        }

        // Prepare context for LLM
        $roomsData = $rooms->map(fn($r) => [
            'id' => $r->id,
            'topic' => $r->topic,
        ])->toJson();

        $papersData = $papers->map(fn($p) => [
            'id' => $p->id,
            'title' => $p->title,
            'abstract' => $p->abstract,
        ])->toJson();

        $prompt = <<<EOT
Anda adalah AI asisten "Quenza Conference System" yang ahli dalam mengelompokkan topik riset.
Tugas Anda adalah menempatkan setiap paper ke ruangan yang paling relevan topiknya.

ATURAN:
1. Anda HANYA BOLEH merespon dalam format JSON yang valid tanpa markdown (jangan pakai ```json).
2. Jangan tambahkan teks apa pun di luar JSON.

=== DATA RUANGAN ===
$roomsData

=== DATA PAPER ===
$papersData

=== FORMAT OUTPUT JSON ===
{
  "allocations": [
    {
      "paper_id": 1,
      "room_id": 2
    }
  ]
}
EOT;

        try {
            $response = Http::retry(3, 1000)->post('https://ai-gateway.quenza.id/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a JSON-only response bot.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => 1500,
                'temperature' => 0.1
            ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                // Clean markdown if AI misbehaves
                $content = str_replace(['```json', '```'], '', $content);
                $content = trim($content);

                $data = json_decode($content, true);

                if (isset($data['allocations']) && is_array($data['allocations'])) {
                    $mapping = [];
                    foreach ($data['allocations'] as $alloc) {
                        $mapping[$alloc['paper_id']] = $alloc['room_id'];
                    }
                    return $mapping;
                }
            }
        } catch (\Exception $e) {
            Log::error('AI Scheduling Error: ' . $e->getMessage());
        }

        // Fallback: Random allocation if API fails
        $mapping = [];
        $roomIds = $rooms->pluck('id')->toArray();
        foreach ($papers as $paper) {
            $mapping[$paper->id] = $roomIds[array_rand($roomIds)];
        }
        return $mapping;
    }
}

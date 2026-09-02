<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiNotificationService
{
    /**
     * Get AI generated email draft for reviewer reminder.
     */
    public function generateReminderDraft(array $data): array
    {
        // Hindari PHP timeout karena proses AI memakan waktu
        set_time_limit(120);

        // Build the prompt from the architecture document
        $systemPrompt = "Anda adalah asisten AI untuk kepanitiaan \"{$data['conference_name']}\".
Tugas Anda adalah menulis draf email pengingat (reminder) yang sangat sopan dan profesional kepada Reviewer konferensi akademik yang mendekati tenggat waktu (deadline) review naskah.

ATURAN:
1. Anda HANYA BOLEH merespon dalam format JSON yang valid.
2. Jangan menambahkan teks basa-basi apapun di luar format JSON.
3. Gunakan bahasa Indonesia yang formal, sopan, dan sangat menghargai kesibukan akademisi (Reviewer).

=== DATA INPUT DARI SISTEM ===
Nama Reviewer: {$data['reviewer_name']}
Judul Paper: {$data['paper_title']}
Tenggat Waktu Review: {$data['deadline_date']}
Tanggal Hari Ini: {$data['current_date']}
Nama Konferensi: {$data['conference_name']}

=== FORMAT OUTPUT JSON ===
{
  \"email_draft\": {
    \"subject\": \"Subjek email yang jelas, sopan, dan ada urgensi waktu\",
    \"body\": \"Isi email lengkap dari salam pembuka hingga penutup (gunakan susunan paragraf yang baik dengan karakter \\n untuk baris baru).\"
  }
}";

        // REAL IMPLEMENTATION: Memanggil LLM API Gateway
        $apiKey = env('OPENAI_API_KEY');
        
        if (empty($apiKey)) {
            Log::warning('OPENAI_API_KEY is not set. Returning fallback notification.');
            $errorMessage = 'OPENAI_API_KEY tidak ditemukan di .env';
        } else {
            $errorMessage = 'Gagal terhubung ke AI Gateway Quenza.';
        }

        if (!empty($apiKey)) {
            try {
                $response = Http::withoutVerifying()
                    ->retry(3, 1000)
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
                                'role' => 'user', // Diubah dari system ke user agar AI Gateway tidak bingung
                                'content' => $systemPrompt
                            ],
                        ],
                        'temperature' => 0.4,
                        'max_tokens' => 300
                    ]);

                if ($response->successful()) {
                    $rawBody = $response->body();
                    
                    // BUGS DI GATEWAY: Gateway menambahkan "data: [DONE" di akhir body HTTP
                    $rawBody = preg_replace('/data:\s*\[DONE\].*$/is', '', $rawBody);
                    $rawBody = trim($rawBody);
                    
                    $parsedBody = json_decode($rawBody, true);
                    $content = $parsedBody['choices'][0]['message']['content'] ?? '';
                    
                    // Bersihkan potensi blok markdown (```json ... ```) dari balasan AI
                    $content = preg_replace('/^```json\s*/i', '', $content);
                    $content = preg_replace('/```$/', '', trim($content));
                    
                    // Parse JSON dari dalam konten
                    $result = json_decode($content, true);
                    
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $errorMessage = 'Gagal membaca balasan AI. (Error: ' . json_last_error_msg() . '). Kemungkinan model berhalusinasi.';
                        Log::error('JSON Decode Error: ' . json_last_error_msg() . ' | Content: ' . $content);
                    } elseif (isset($result['email_draft']) && is_array($result['email_draft'])) {
                        return $result['email_draft'];
                    } else {
                        $errorMessage = 'Format JSON AI salah (Tidak ada kunci "email_draft").';
                        Log::error('Invalid AI Response Format. Content: ' . $content);
                    }
                } else {
                    $errorMessage = 'API Error (' . $response->status() . '). Coba lagi nanti.';
                    Log::error('LLM API Error: ' . $response->body());
                }

            } catch (\Exception $e) {
                $errorMessage = 'Timeout / Koneksi Terputus: ' . $e->getMessage();
                Log::error('Exception in AI Notification: ' . $e->getMessage());
            }
        }

        // DUMMY IMPLEMENTATION: Fallback data jika API gagal
        // Ini memastikan UI tidak crash dan tetap menampilkan simulasi draf email
        return [
            'subject' => '[SIMULASI] Pengingat Tenggat Waktu Review Naskah',
            'body' => "Yth. {$data['reviewer_name']},\n\nMohon maaf, sistem gagal memuat draf dari AI karena: {$errorMessage}\n\nIni adalah draf email statis cadangan (dummy). Kami mengingatkan bahwa tenggat waktu review untuk naskah \"{$data['paper_title']}\" adalah pada tanggal {$data['deadline_date']}.\n\nTerima kasih atas dedikasi Anda.\n\nSalam,\nPanitia {$data['conference_name']}"
        ];
    }
}

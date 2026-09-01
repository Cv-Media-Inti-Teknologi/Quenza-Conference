<?php

namespace App\Http\Controllers;

use App\Services\AiNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SmartNotificationMail;

class AiNotificationController extends Controller
{
    /**
     * Generate an AI-drafted email reminder for a reviewer.
     */
    public function generateReminderDraft(Request $request, AiNotificationService $aiService): JsonResponse
    {
        $request->validate([
            'reviewer_name' => 'required|string',
            'paper_title' => 'required|string',
            'deadline_date' => 'required|string',
        ]);

        $data = [
            'reviewer_name' => $request->reviewer_name,
            'paper_title' => $request->paper_title,
            'deadline_date' => $request->deadline_date,
            'current_date' => now()->format('d F Y'),
            'conference_name' => 'Quenza International Conference',
        ];

        $draft = $aiService->generateReminderDraft($data);

        return response()->json([
            'status' => 'success',
            'draft' => $draft
        ]);
    }

    public function sendReminderEmail(Request $request): JsonResponse
    {
        $request->validate([
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        // MENGIRIM EMAIL BENERAN
        // Karena di .env masih pakai MAIL_MAILER=log, ini hanya akan masuk ke laravel.log
        // Jika nanti diganti smtp, ini akan langsung terkirim ke inbox!
        
        $dummyReviewerEmail = 'reviewer@quenza.id'; // Idealnya ini dari database
        
        Mail::to($dummyReviewerEmail)->send(
            new SmartNotificationMail($request->subject, $request->body)
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Email terkirim ke sistem!'
        ]);
    }
}

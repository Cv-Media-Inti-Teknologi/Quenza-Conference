<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperReview;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class ReviewerController extends Controller
{
    public function dashboard()
    {
        $reviewerId = auth()->id();
        
        $pendingCount = PaperReview::where('reviewer_id', $reviewerId)
            ->where('status', 'pending')
            ->count();
        
        $completedCount = PaperReview::where('reviewer_id', $reviewerId)
            ->where('status', 'completed')
            ->count();
        
        $recentPapers = PaperReview::where('reviewer_id', $reviewerId)
            ->where('status', 'pending')
            ->with('paper')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($review) => [
                'paper_id' => $review->paper->id,
                'title' => $review->paper->title,
                'track' => $review->paper->track,
                'similarity_score' => $review->paper->similarity_score,
                'status' => $review->status,
                'assigned_date' => $review->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('ReviewerDashboard', [
            'pending_count' => $pendingCount,
            'completed_count' => $completedCount,
            'total_assigned' => $pendingCount + $completedCount,
            'recent_papers' => $recentPapers,
        ]);
    }

    public function reviews()
    {
        return Inertia::render('MyReviews');
    }

    public function reviewDetail($paperId)
    {
        return Inertia::render('ReviewDetail', [
            'paperId' => (int) $paperId,
        ]);
    }

    public function getMyReviews(Request $request): JsonResponse
    {
        $reviewerId = auth()->id();
        $query = PaperReview::where('reviewer_id', $reviewerId)
            ->with('paper');

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->whereHas('paper', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $reviews = $query->paginate(20);

        return response()->json([
            'data' => $reviews->map(fn ($review) => [
                'paper_id' => 'P-' . str_pad($review->paper->id, 3, '0', STR_PAD_LEFT),
                'title' => $review->paper->title,
                'track' => $review->paper->track,
                'similarity_score' => $review->paper->similarity_score,
                'status' => $review->status,
                'assigned_date' => $review->created_at->format('d/m/Y'),
            ]),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'total' => $reviews->total(),
                'per_page' => $reviews->perPage(),
            ],
        ]);
    }

    public function getReviewDetail($paperId): JsonResponse
    {
        $reviewerId = auth()->id();
        
        $review = PaperReview::where('paper_id', $paperId)
            ->where('reviewer_id', $reviewerId)
            ->with('paper')
            ->firstOrFail();

        $paper = $review->paper;

        return response()->json([
            'paper_id' => 'P-' . str_pad($paper->id, 3, '0', STR_PAD_LEFT),
            'title' => $paper->title,
            'abstract' => $paper->abstract,
            'track' => $paper->track,
            'similarity_score' => $paper->similarity_score,
            'author' => [
                'name' => '(Anonymous)',
                'institution' => '(Hidden)',
            ],
            'current_review' => $review->status === 'completed' ? [
                'score' => $review->score,
                'comment' => $review->comment,
                'decision' => $review->decision ?? null,
                'submitted_at' => $review->submitted_at?->format('d/m/Y H:i'),
            ] : null,
            'review_status' => $review->status,
        ]);
    }

    public function submitReview($paperId, Request $request): JsonResponse
    {
        $request->validate([
            'score' => 'required|integer|min:1|max:10',
            'comment' => 'required|string|min:10',
            'decision' => 'required|in:approve,revision,reject',
        ]);

        $reviewerId = auth()->id();
        
        $review = PaperReview::where('paper_id', $paperId)
            ->where('reviewer_id', $reviewerId)
            ->firstOrFail();

        $review->update([
            'score' => $request->get('score'),
            'comment' => $request->get('comment'),
            'decision' => $request->get('decision'),
            'status' => 'completed',
            'submitted_at' => now(),
        ]);

        $paper = $review->paper;
        $newStatus = match ($request->get('decision')) {
            'approve' => 'accepted',
            'revision' => 'revision_required',
            'reject' => 'rejected',
            default => $paper->status,
        };
        $paper->update(['status' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil disubmit',
            'review' => [
                'id' => $review->id,
                'status' => $review->status,
                'decision' => $review->decision,
                'submitted_at' => $review->submitted_at?->format('d/m/Y H:i'),
            ],
        ]);
    }

    public function getReviewHistory(): JsonResponse
    {
        $reviewerId = auth()->id();
        
        $history = PaperReview::where('reviewer_id', $reviewerId)
            ->where('status', 'completed')
            ->with('paper')
            ->orderBy('submitted_at', 'desc')
            ->get();

        return response()->json([
            'data' => $history->map(fn ($review) => [
                'paper_id' => 'P-' . str_pad($review->paper->id, 3, '0', STR_PAD_LEFT),
                'title' => $review->paper->title,
                'decision' => $review->decision,
                'score' => $review->score,
                'submitted_at' => $review->submitted_at?->format('d/m/Y H:i'),
                'comment' => $review->comment,
            ]),
        ]);
    }
}

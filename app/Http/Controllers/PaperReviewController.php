<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperReview;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaperReviewController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('PapersReview');
    }

    public function getPapersTable(Request $request): JsonResponse
    {
        $query = Paper::with('author', 'reviews');

        if ($request->filled('status') && $request->input('status') !== 'Semua Status') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('track') && $request->input('track') !== 'Semua Track') {
            $query->where('track', $request->input('track'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $papers = $query->paginate(20);

        $data = $papers->map(function ($paper) {
            return [
                'id' => 'P-' . str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
                'title' => $paper->title,
                'track' => $paper->track,
                'similarity_score' => $paper->similarity_score,
                'status' => $paper->status,
                'submitted_at' => $paper->submitted_at->format('d/m/Y'),
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'current_page' => $papers->currentPage(),
                'total' => $papers->total(),
                'per_page' => $papers->perPage(),
            ],
        ]);
    }

    public function getPaperDetail($id): JsonResponse
    {
        $paper = Paper::with('author', 'reviews.reviewer')->findOrFail($id);

        return response()->json([
            'id' => $paper->id,
            'title' => $paper->title,
            'abstract' => $paper->abstract,
            'track' => $paper->track,
            'similarity_score' => $paper->similarity_score,
            'status' => $paper->status,
            'submitted_at' => $paper->submitted_at->format('d/m/Y H:i'),
            'author' => [
                'name' => '(Anonymous)',
                'institution' => '(Hidden)',
            ],
            'reviews' => $paper->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'reviewer_name' => $review->reviewer?->name ?? 'Unknown',
                    'score' => $review->score,
                    'comment' => $review->comment,
                    'status' => $review->status,
                    'submitted_at' => $review->submitted_at?->format('d/m/Y H:i'),
                ];
            })->toArray(),
        ]);
    }

    public function getAiRecommendations($id, \App\Services\AiRecommendationService $aiService): JsonResponse
    {
        $paper = Paper::findOrFail($id);
        
        $recommendedReviewers = $aiService->getRecommendations($paper);
        
        return response()->json([
            'id' => 'P-' . str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
            'recommended_reviewers' => $recommendedReviewers,
        ]);
    }

    public function updatePaperStatus($id, Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:submitted,under_review,revision_required,accepted,rejected',
        ]);

        $paper = Paper::findOrFail($id);
        $paper->update(['status' => $request->input('status')]);

        return response()->json([
            'success' => true,
            'message' => 'Paper status updated successfully',
            'paper' => [
                'id' => $paper->id,
                'status' => $paper->status,
            ],
        ]);
    }

    public function getReviewersList(Request $request): JsonResponse
    {
        $query = User::where('role', 'reviewer');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('expertise', 'like', "%{$search}%");
            });
        }

        $reviewers = $query->get();

        $data = $reviewers->map(function ($reviewer) {
            $assignedPapersCount = PaperReview::where('reviewer_id', $reviewer->id)->count();

            return [
                'id' => $reviewer->id,
                'name' => $reviewer->name,
                'institution' => $reviewer->institution,
                'expertise' => $reviewer->expertise,
                'assigned_papers' => $assignedPapersCount,
            ];
        });

        return response()->json([
            'data' => $data,
        ]);
    }

    public function getDashboardMetrics(Request $request): JsonResponse
    {
        $period = $request->input('period', 'month');
        $daysBack = match ($period) {
            'today' => 1,
            'week' => 7,
            'month' => 30,
            default => 30,
        };

        $submissionTrend = [
            ['date' => 'Mon', 'count' => 12],
            ['date' => 'Tue', 'count' => 19],
            ['date' => 'Wed', 'count' => 8],
            ['date' => 'Thu', 'count' => 15],
            ['date' => 'Fri', 'count' => 22],
        ];

        $paperReviewedTrend = [
            ['date' => 'Mon', 'count' => 5],
            ['date' => 'Tue', 'count' => 8],
            ['date' => 'Wed', 'count' => 3],
            ['date' => 'Thu', 'count' => 12],
            ['date' => 'Fri', 'count' => 10],
        ];

        $acceptedTrend = [
            ['date' => 'Mon', 'count' => 2],
            ['date' => 'Tue', 'count' => 3],
            ['date' => 'Wed', 'count' => 1],
            ['date' => 'Thu', 'count' => 4],
            ['date' => 'Fri', 'count' => 5],
        ];

        $totalSubmissions = Paper::count();
        $totalAccepted = Paper::where('status', 'accepted')->count();
        $totalReviewed = PaperReview::whereNotNull('submitted_at')->count();
        $topTracks = Paper::selectRaw('track, COUNT(*) as count')
            ->groupBy('track')
            ->orderByDesc('count')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'track' => $item->track,
                    'count' => $item->count,
                ];
            });

        $queueStats = [
            'not_assigned' => Paper::where('status', 'submitted')->count(),
            'assigned' => Paper::where('status', 'under_review')->count(),
            'in_review' => PaperReview::where('status', 'in_progress')->count(),
        ];

        return response()->json([
            'submission_trend' => $submissionTrend,
            'paper_reviewed_trend' => $paperReviewedTrend,
            'accepted_trend' => $acceptedTrend,
            'total_submissions' => $totalSubmissions,
            'total_accepted' => $totalAccepted,
            'total_trend_percent' => '+18%',
            'total_reviewed' => $totalReviewed,
            'reviewed_trend_percent' => '+5%',
            'total_accepted_count' => $totalAccepted,
            'accepted_trend_percent' => '+8%',
            'queue' => $queueStats,
            'top_tracks' => $topTracks,
        ]);
    }
}

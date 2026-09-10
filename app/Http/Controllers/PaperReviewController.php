<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperReview;
use App\Models\User;
use App\Services\AiRecommendationService;
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
                'id' => 'P-'.str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
                'title' => $paper->title,
                'track' => $paper->track,
                'similarity_score' => $paper->similarity_score,
                'status' => $paper->status,
                'submitted_at' => $paper->submitted_at?->format('d/m/Y'),
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
            'submitted_at' => $paper->submitted_at?->format('d/m/Y H:i'),
            'author' => [
                'name' => $paper->author?->name ?? '(Anonymous)',
                'institution' => $paper->author?->institution ?? '(Hidden)',
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

    public function getAiRecommendations($id, AiRecommendationService $aiService): JsonResponse
    {
        $paper = Paper::findOrFail($id);

        $recommendedReviewers = $aiService->getRecommendations($paper);

        return response()->json([
            'id' => 'P-'.str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
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

    public function assignReviewer(Request $request, $id): JsonResponse
    {
        $request->validate([
            'reviewer_id' => 'required|exists:users,id',
        ]);

        $paper = Paper::findOrFail($id);

        // Cek apakah reviewer sudah di-assign ke paper ini
        $alreadyAssigned = PaperReview::where('paper_id', $paper->id)
            ->where('reviewer_id', $request->input('reviewer_id'))
            ->exists();

        if ($alreadyAssigned) {
            return response()->json([
                'success' => false,
                'message' => 'Reviewer sudah ditugaskan ke paper ini.',
            ], 422);
        }

        $review = PaperReview::create([
            'paper_id' => $paper->id,
            'reviewer_id' => $request->input('reviewer_id'),
            'status' => 'in_progress',
        ]);

        // Update status paper jadi under_review kalau belum
        if ($paper->status === 'submitted') {
            $paper->update(['status' => 'under_review']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Reviewer berhasil ditugaskan.',
            'review' => [
                'id' => $review->id,
                'reviewer_id' => $review->reviewer_id,
                'status' => $review->status,
            ],
        ]);
    }

    public function getDashboardMetrics(Request $request): JsonResponse
    {
        $totalSubmissions = Paper::count();
        $totalAccepted = Paper::where('status', 'accepted')->count();
        $totalReviewed = PaperReview::whereNotNull('submitted_at')->count();
        
        // Dynamic Trends (Last 7 days)
        $submissionTrend = Paper::selectRaw("strftime('%d/%m', created_at) as date, count(*) as count")
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('created_at')
            ->get();

        $paperReviewedTrend = PaperReview::selectRaw("strftime('%d/%m', submitted_at) as date, count(*) as count")
            ->whereNotNull('submitted_at')
            ->where('submitted_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('submitted_at')
            ->get();

        // Hitung trend persentase (compared to previous period)
        $prevSubmission = Paper::where('created_at', '<', now()->subDays(7))->count();
        $totalTrendPercent = $prevSubmission > 0 ? round((($totalSubmissions - $prevSubmission) / $prevSubmission) * 100, 1) : 0;

        $prevReviewed = PaperReview::where('submitted_at', '<', now()->subDays(7))->whereNotNull('submitted_at')->count();
        $reviewedTrendPercent = $prevReviewed > 0 ? round((($totalReviewed - $prevReviewed) / $prevReviewed) * 100, 1) : 0;

        // Accepted trend (last 7 days vs previous)
        $acceptedTrends = Paper::selectRaw("strftime('%d/%m', created_at) as date, count(*) as count")
            ->where('status', 'accepted')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('created_at')
            ->get();

        $prevAccepted = Paper::where('status', 'accepted')->where('created_at', '<', now()->subDays(7))->count();
        $acceptedTrendPercent = $prevAccepted > 0 ? round((($totalAccepted - $prevAccepted) / $prevAccepted) * 100, 1) : 0;

        $topTracks = Paper::selectRaw('track, COUNT(*) as count')
            ->whereNotNull('track')
            ->groupBy('track')
            ->orderByDesc('count')
            ->limit(3)
            ->get()
            ->map(fn($item) => ['name' => $item->track, 'count' => $item->count]);

        $queueStats = [
            'not_assigned' => Paper::where('status', 'submitted')->count(),
            'assigned' => Paper::where('status', 'under_review')->count(),
            'in_review' => PaperReview::where('status', 'in_progress')->count(),
        ];

        return response()->json([
            'submission_trend' => $submissionTrend,
            'paper_reviewed_trend' => $paperReviewedTrend,
            'accepted_trend' => $acceptedTrends,
            'total_submissions' => $totalSubmissions,
            'total_accepted' => $totalAccepted,
            'total_accepted_count' => $totalAccepted,
            'total_reviewed' => $totalReviewed,
            'total_trend_percent' => $totalTrendPercent,
            'reviewed_trend_percent' => $reviewedTrendPercent,
            'accepted_trend_percent' => $acceptedTrendPercent,
            'not_assigned' => $queueStats['not_assigned'],
            'assigned' => $queueStats['assigned'],
            'in_review' => $queueStats['in_review'],
            'queue' => $queueStats,
            'top_tracks' => $topTracks,
        ]);
    }
}

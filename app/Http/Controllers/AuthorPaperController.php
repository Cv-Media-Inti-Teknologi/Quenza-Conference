<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Paper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AuthorPaperController extends Controller
{
    /**
     * Tampilkan halaman submit paper baru.
     */
    public function create(Request $request): Response
    {
        // Pastikan user berhak submit (author, atau super_admin untuk testing)
        if (! in_array($request->user()->role, ['author', 'super_admin'], true)) {
            return Inertia::render('Error', [
                'message' => 'Hanya author yang dapat submit paper. Belilah paket Presenter/Author terlebih dahulu di halaman Pembayaran.',
            ]);
        }

        // Author harus terverifikasi (sudah bayar registrasi) sebelum submit
        if (! $request->user()->isVerified()) {
            return Inertia::render('Author/SubmitPaper', [
                'notVerified' => true,
            ]);
        }

        return Inertia::render('Author/SubmitPaper');
    }

    /**
     * Simpan paper baru dari author.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        // Hanya author (atau super_admin untuk testing) yang bisa submit
        if (! in_array($request->user()->role, ['author', 'super_admin'], true)) {
            return redirect()->back()->with('error', 'Hanya author yang dapat submit paper. Belilah paket Presenter/Author terlebih dahulu di halaman Pembayaran.');
        }

        // Author harus terverifikasi (sudah bayar registrasi) sebelum submit
        if (! $request->user()->isVerified()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun Anda belum terverifikasi. Selesaikan pembayaran registrasi terlebih dahulu.',
                ], 403);
            }

            return redirect()
                ->route('author.papers')
                ->with('error', 'Akun Anda belum terverifikasi. Selesaikan pembayaran registrasi terlebih dahulu.');
        }

        $validated = $request->validate([
            'title' => 'required|string|min:10|max:500',
            'abstract' => 'required|string|min:100',
            'full_text' => 'nullable|string|min:1000|required_without:paper_file',
            'track' => 'required|string|in:AI & Data Science,Pendidikan Digital,Kesehatan Masyarakat,Ekonomi Digital,Teknologi Informasi,Kecerdasan Buatan,Sistem Terdistribusi',
            // File PDF opsional: max 10 MB, tipe dokumen
            'paper_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // Simpan file paper (jika diupload) ke storage/app/private/papers
        $filePath = null;
        $fileName = null;
        $fileSize = null;
        if ($request->hasFile('paper_file')) {
            $file = $request->file('paper_file');
            $storedPath = $file->store('papers');
            $filePath = $storedPath;
            $fileName = $file->getClientOriginalName();
            $fileSize = (int) round($file->getSize() / 1024); // KB
        }

        $paper = Paper::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'abstract' => $validated['abstract'],
            'full_text' => $validated['full_text'],
            'track' => $validated['track'],
            'status' => 'submitted',
            'submitted_at' => now(),
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_size' => $fileSize,
        ]);

        // Response JSON hanya untuk API client; request web diarahkan kembali
        // ke daftar paper dengan flash success (supaya UI Inertia update).
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Paper berhasil disubmit!',
                'paper' => [
                    'id' => 'P-' . str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
                    'title' => $paper->title,
                    'track' => $paper->track,
                    'status' => $paper->status,
                ],
            ], 201);
        }

        return redirect()
            ->route('author.papers')
            ->with('success', 'Paper "'.$paper->title.'" berhasil disubmit dan menunggu proses review.');
    }

    /**
     * Tampilkan list paper yang di-submit oleh author.
     */
    public function index(Request $request): Response
    {
        if (! in_array($request->user()->role, ['author', 'super_admin'], true)) {
            return Inertia::render('Error', ['message' => 'Hanya author yang dapat mengakses halaman ini.']);
        }
        $papers = Paper::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($paper) => [
                'id' => 'P-' . str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
                'title' => $paper->title,
                'track' => $paper->track,
                'status' => $paper->status,
                'submitted_at' => $paper->submitted_at?->format('d/m/Y H:i'),
                'similarity_score' => $paper->similarity_score,
                'submitted_atFormatted' => $paper->submitted_at?->format('d/m/Y H:i'),
                'file_name' => $paper->file_name,
            ]);

        return Inertia::render('Author/MyPapers', [
            'papers' => $papers,
            'notVerified' => ! $request->user()->isVerified(),
        ]);
    }

    /**
     * Tampilkan detail paper tertentu.
     */
    public function show(Request $request, $id): Response
    {
        if (! in_array($request->user()->role, ['author', 'super_admin'], true)) {
            return Inertia::render('Error', ['message' => 'Hanya author yang dapat mengakses halaman ini.']);
        }

        // Terima id format 'P-001' maupun angka biasa
        $paperId = (int) preg_replace('/\D/', '', (string) $id);
        $paper = Paper::where('id', $paperId)
            ->where('user_id', $request->user()->id)
            ->with('reviews.reviewer')
            ->first();

        if (!$paper) {
            return Inertia::render('Error', ['message' => 'Paper tidak ditemukan.']);
        }

        return Inertia::render('Author/PaperDetail', [
            'paper' => [
                'id' => 'P-' . str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
                'title' => $paper->title,
                'abstract' => $paper->abstract,
                'full_text' => $paper->full_text,
                'track' => $paper->track,
                'status' => $paper->status,
                'submitted_at' => $paper->submitted_at?->format('d/m/Y H:i'),
                'similarity_score' => $paper->similarity_score,
                'file_name' => $paper->file_name,
                'file_size' => $paper->file_size,
                'file_url' => $paper->file_path ? route('author.paper.download', ['id' => $paper->id]) : null,
                'reviews' => $paper->reviews->map(fn($review) => [
                    'id' => $review->id,
                    'reviewer_name' => $review->reviewer?->name ?? 'Unknown',
                    'score' => $review->score,
                    'comment' => $review->comment,
                    'decision' => $review->decision,
                    'status' => $review->status,
                    'submitted_at' => $review->submitted_at?->format('d/m/Y H:i'),
                ]),
            ],
        ]);
    }

    /**
     * Download file paper milik author (private storage, via controller).
     */
    public function download(Request $request, $id)
    {
        $paper = Paper::where('id', (int) preg_replace('/\D/', '', (string) $id))
            ->where('user_id', $request->user()->id)
            ->whereNotNull('file_path')
            ->firstOrFail();

        abort_unless(Storage::exists($paper->file_path), 404, 'File paper tidak ditemukan.');

        return Storage::download($paper->file_path, $paper->file_name ?? ('paper-'.$paper->id.'.pdf'));
    }

    /**
     * Halaman upload/replace file paper (untuk paper yang sudah disubmit tanpa file).
     */
    public function uploadForm(Request $request, $id): Response
    {
        $paper = Paper::where('id', (int) preg_replace('/\D/', '', (string) $id))
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $paper) {
            return Inertia::render('Error', ['message' => 'Paper tidak ditemukan.']);
        }

        return Inertia::render('Author/UploadPaper', [
            'paper' => [
                'id' => 'P-' . str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT),
                'title' => $paper->title,
                'track' => $paper->track,
                'status' => $paper->status,
                'file_name' => $paper->file_name,
                'file_size' => $paper->file_size,
            ],
        ]);
    }

    /**
     * Simpan file paper yang diupload (upload baru atau replace).
     */
    public function uploadFile(Request $request, $id): RedirectResponse
    {
        $paper = Paper::where('id', (int) preg_replace('/\D/', '', (string) $id))
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $paper) {
            return redirect()->route('author.papers')->with('error', 'Paper tidak ditemukan.');
        }

        $request->validate([
            'paper_file' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // Hapus file lama jika replace
        if ($paper->file_path && Storage::exists($paper->file_path)) {
            Storage::delete($paper->file_path);
        }

        $file = $request->file('paper_file');

        $paper->update([
            'file_path' => $file->store('papers'),
            'file_name' => $file->getClientOriginalName(),
            'file_size' => (int) round($file->getSize() / 1024),
        ]);

        return redirect()
            ->route('author.paper.detail', ['id' => 'P-' . str_pad((string) $paper->id, 3, '0', STR_PAD_LEFT)])
            ->with('success', 'File paper berhasil diupload.');
    }
}

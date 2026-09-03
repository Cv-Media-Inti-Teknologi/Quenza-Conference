<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\LandingContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsLandingController extends Controller
{
    /**
     * Display the CMS Landing Page management interface.
     */
    public function index(): Response
    {
        $landingData = LandingContent::current();

        return Inertia::render('Admin/CmsLandingPage', [
            'landingData' => $landingData,
        ]);
    }

    /**
     * Update the CMS Landing Page content.
     * Implements OWASP input validation, secure file handling, and audit logging.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Info Utama
            'conference_title' => ['required', 'string', 'max:255'],
            'conference_theme' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'date_range' => ['required', 'string', 'max:100'],
            'edition' => ['required', 'string', 'max:50'],
            'location' => ['required', 'string', 'max:255'],

            // Image Slider validation
            'slider_images' => ['nullable', 'array'],
            'slider_images.*.id' => ['nullable', 'string', 'max:100'],
            'slider_images.*.image' => ['nullable', 'string', 'max:2048'],
            'slider_images.*.caption' => ['nullable', 'string', 'max:255'],

            // Speakers validation
            'speakers' => ['nullable', 'array'],
            'speakers.*.id' => ['nullable', 'string', 'max:100'],
            'speakers.*.name' => ['required', 'string', 'max:150'],
            'speakers.*.affiliation' => ['required', 'string', 'max:200'],
            'speakers.*.expertise' => ['nullable', 'string', 'max:200'],
            'speakers.*.role' => ['required', 'string', 'max:100'],
            'speakers.*.avatar' => ['nullable', 'string', 'max:2048'],

            // Important Dates / Linimasa validation (supports both simple keterangan/tanggal and classic title/date_info)
            'important_dates' => ['nullable', 'array'],
            'important_dates.*.id' => ['nullable', 'string', 'max:100'],
            'important_dates.*.keterangan' => ['nullable', 'string', 'max:200'],
            'important_dates.*.tanggal' => ['nullable', 'string', 'max:100'],
            'important_dates.*.title' => ['nullable', 'string', 'max:200'],
            'important_dates.*.date_info' => ['nullable', 'string', 'max:100'],
            'important_dates.*.description' => ['nullable', 'string', 'max:1000'],
            'important_dates.*.status' => ['nullable', 'string', 'in:completed,active,ongoing,upcoming'],

            // Partner / Sponsor validation (OWASP URL check to prevent XSS/SSRF)
            'sponsors' => ['nullable', 'array'],
            'sponsors.*.id' => ['nullable', 'string', 'max:100'],
            'sponsors.*.name' => ['required', 'string', 'max:150'],
            'sponsors.*.tier' => ['required', 'string', 'max:100'],
            'sponsors.*.logo' => ['nullable', 'string', 'max:2048'],
            'sponsors.*.website_url' => ['nullable', 'url:http,https', 'max:500'],
            'sponsors.*.redirect_link' => ['nullable', 'url:http,https', 'max:500'],
            'sponsors.*.description' => ['nullable', 'string', 'max:500'],

            // Pendaftaran Paper validation
            'paper_registration' => ['nullable', 'array'],
            'paper_registration.presentation_type' => ['nullable', 'string', 'in:Speech,Poster'],
            'paper_registration.paper_title' => ['nullable', 'string', 'max:255'],
            'paper_registration.file_url' => ['nullable', 'string', 'max:2048'],
            'paper_registration.file_name' => ['nullable', 'string', 'max:255'],
        ]);

        // Thoroughly sanitize and normalize important_dates
        if (isset($validated['important_dates']) && is_array($validated['important_dates'])) {
            $validated['important_dates'] = array_map(function ($item) {
                $label = $this->sanitizeString($item['keterangan'] ?? $item['title'] ?? '', 200);
                $dateStr = $this->sanitizeString($item['tanggal'] ?? $item['date_info'] ?? '', 100);
                $desc = $this->sanitizeString($item['description'] ?? null, 1000);
                $status = in_array($item['status'] ?? '', ['completed', 'active', 'ongoing', 'upcoming'], true)
                    ? $item['status']
                    : 'upcoming';

                return [
                    'id' => $this->sanitizeString($item['id'] ?? 'date-'.uniqid(), 100),
                    'keterangan' => $label,
                    'title' => $label,
                    'tanggal' => $dateStr,
                    'date_info' => $dateStr,
                    'description' => $desc,
                    'status' => $status,
                ];
            }, $validated['important_dates']);
        }

        // Thoroughly sanitize and normalize sponsors
        if (isset($validated['sponsors']) && is_array($validated['sponsors'])) {
            $validated['sponsors'] = array_map(function ($sp) {
                $rawLink = $sp['website_url'] ?? $sp['redirect_link'] ?? null;
                $link = $this->sanitizeUrl($rawLink, 500);

                return [
                    'id' => $this->sanitizeString($sp['id'] ?? 'sponsor-'.uniqid(), 100),
                    'name' => $this->sanitizeString($sp['name'] ?? '', 150),
                    'tier' => $this->sanitizeString($sp['tier'] ?? 'Platinum Sponsor', 100),
                    'logo' => $this->sanitizeUrl($sp['logo'] ?? null, 2048),
                    'website_url' => $link,
                    'redirect_link' => $link,
                    'description' => $this->sanitizeString($sp['description'] ?? null, 500),
                ];
            }, $validated['sponsors']);
        }

        // Thoroughly sanitize paper_registration
        if (isset($validated['paper_registration']) && is_array($validated['paper_registration'])) {
            $pr = $validated['paper_registration'];
            $type = in_array($pr['presentation_type'] ?? '', ['Speech', 'Poster'], true) ? $pr['presentation_type'] : 'Speech';

            $validated['paper_registration'] = [
                'presentation_type' => $type,
                'paper_title' => $this->sanitizeString($pr['paper_title'] ?? '', 255),
                'file_url' => $this->sanitizeUrl($pr['file_url'] ?? null, 2048),
                'file_name' => $this->sanitizeFilename($pr['file_name'] ?? null),
            ];
        }

        // Sanitize general conference fields
        $validated['conference_title'] = $this->sanitizeString($validated['conference_title'], 255);
        $validated['conference_theme'] = $this->sanitizeString($validated['conference_theme'], 255);
        $validated['description'] = $this->sanitizeString($validated['description'] ?? null, 2000);
        $validated['date_range'] = $this->sanitizeString($validated['date_range'], 100);
        $validated['edition'] = $this->sanitizeString($validated['edition'], 50);
        $validated['location'] = $this->sanitizeString($validated['location'], 255);

        $content = LandingContent::current();
        $content->update($validated);

        // OWASP A09: Security Logging & Audit Trail
        $user = Auth::user();
        Log::info(sprintf(
            'Admin [ID: %d, Name: %s, IP: %s] updated CMS Landing Page contents.',
            $user?->id ?? 0,
            $user?->name ?? 'Unknown',
            $request->ip()
        ));

        return back()->with('success', 'Konten Landing Page berhasil disimpan dan diperbarui secara langsung.');
    }

    /**
     * Upload an image or document file securely (OWASP A08: Software & Data Integrity).
     * Strictly verifies mime type, size, and sanitizes filenames.
     */
    public function uploadMedia(Request $request): JsonResponse
    {
        $type = $request->input('type') ?? 'general';

        if ($type === 'paper') {
            $request->validate([
                'image' => [
                    'required',
                    'file',
                    'mimes:pdf',
                    'max:10240', // 10MB max for PDF paper documents
                ],
                'type' => ['nullable', 'string'],
            ]);
        } else {
            $request->validate([
                'image' => [
                    'required',
                    'file',
                    'mimes:jpeg,jpg,png,webp,svg',
                    'max:2048', // 2MB max for images
                ],
                'type' => ['nullable', 'string', 'in:slider,speaker,sponsor,general,paper'],
            ]);
        }

        $file = $request->file('image');
        if (! $file || ! $file->isValid()) {
            return response()->json(['error' => 'File tidak valid atau gagal diunggah.'], 422);
        }

        // Generate cryptographically secure randomized filename to prevent directory traversal
        $extension = $file->getClientOriginalExtension();
        $safeFileName = Str::random(40).'.'.strtolower($extension);
        $folder = 'landing/'.($type ?? 'general');

        $path = $file->storeAs($folder, $safeFileName, 'public');
        $publicUrl = Storage::url($path);
        $safeOriginalName = $this->sanitizeFilename($file->getClientOriginalName());

        return response()->json([
            'success' => true,
            'url' => $publicUrl,
            'filename' => $safeFileName,
            'original_name' => $safeOriginalName,
        ]);
    }

    /**
     * Sanitize plain text string: strips HTML tags, removes control characters, trims whitespace.
     */
    private function sanitizeString(?string $value, int $maxLength = 500): ?string
    {
        if ($value === null) {
            return null;
        }

        // Remove script and style tags completely including their inner contents
        $clean = preg_replace('/<(script|style)\b[^>]*>(.*?)<\/\1>/is', '', $value);
        // Strip remaining HTML tags
        $clean = strip_tags($clean);
        // Strip control characters (except newline \n and tab \t)
        $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $clean);
        $clean = trim($clean ?? '');

        return mb_substr($clean, 0, $maxLength);
    }

    /**
     * Sanitize URL: only allows http, https, and relative storage paths.
     * Rejects javascript:, data:, vbscript:, and invalid schemas (OWASP SSRF / XSS protection).
     */
    private function sanitizeUrl(?string $url, int $maxLength = 500): ?string
    {
        if ($url === null || trim($url) === '') {
            return null;
        }

        $trimmed = trim($url);
        $lower = strtolower($trimmed);

        // Explicitly block dangerous script injection schemes
        if (str_starts_with($lower, 'javascript:') || str_starts_with($lower, 'data:') || str_starts_with($lower, 'vbscript:')) {
            return null;
        }

        // Allow relative storage URL
        if (str_starts_with($trimmed, '/storage/') || str_starts_with($trimmed, 'storage/')) {
            return mb_substr('/'.ltrim($trimmed, '/'), 0, $maxLength);
        }

        // Validate standard HTTP/HTTPS URL
        if (filter_var($trimmed, FILTER_VALIDATE_URL) && (str_starts_with($lower, 'http://') || str_starts_with($lower, 'https://'))) {
            return mb_substr($trimmed, 0, $maxLength);
        }

        return null;
    }

    /**
     * Sanitize file name: prevent path traversal (../) and strip special characters.
     */
    private function sanitizeFilename(?string $fileName): string
    {
        if (! $fileName) {
            return 'file.pdf';
        }

        $base = basename(strip_tags($fileName));
        $clean = preg_replace('/[^a-zA-Z0-9_\-\. ]/u', '', $base);

        return mb_substr($clean ?: 'file.pdf', 0, 255);
    }
}

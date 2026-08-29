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

            // Important Dates / Linimasa validation
            'important_dates' => ['nullable', 'array'],
            'important_dates.*.id' => ['nullable', 'string', 'max:100'],
            'important_dates.*.title' => ['required', 'string', 'max:200'],
            'important_dates.*.date_info' => ['required', 'string', 'max:100'],
            'important_dates.*.description' => ['nullable', 'string', 'max:1000'],
            'important_dates.*.status' => ['required', 'string', 'in:completed,active,ongoing,upcoming'],

            // Partner / Sponsor validation (OWASP URL check to prevent XSS/SSRF)
            'sponsors' => ['nullable', 'array'],
            'sponsors.*.id' => ['nullable', 'string', 'max:100'],
            'sponsors.*.name' => ['required', 'string', 'max:150'],
            'sponsors.*.tier' => ['required', 'string', 'max:100'],
            'sponsors.*.logo' => ['nullable', 'string', 'max:2048'],
            'sponsors.*.website_url' => ['nullable', 'url:http,https', 'max:500'],
        ]);

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
     * Upload an image file securely (OWASP A08: Software & Data Integrity).
     * Strictly verifies mime type, size, and sanitizes filenames.
     */
    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'image' => [
                'required',
                'file',
                'mimes:jpeg,jpg,png,webp,svg',
                'max:2048', // 2MB max
            ],
            'type' => ['nullable', 'string', 'in:slider,speaker,sponsor,general'],
        ]);

        $file = $request->file('image');
        if (!$file || !$file->isValid()) {
            return response()->json(['error' => 'File tidak valid atau gagal diunggah.'], 422);
        }

        // Generate cryptographically secure randomized filename to prevent directory traversal
        $extension = $file->getClientOriginalExtension();
        $safeFileName = Str::random(40) . '.' . strtolower($extension);
        $folder = 'landing/' . ($request->input('type') ?? 'general');

        $path = $file->storeAs($folder, $safeFileName, 'public');
        $publicUrl = Storage::url($path);

        return response()->json([
            'success' => true,
            'url' => $publicUrl,
            'filename' => $safeFileName,
        ]);
    }
}

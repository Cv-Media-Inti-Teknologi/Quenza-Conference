<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\LandingContent;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the public landing page for Quenza Conference.
     */
    public function index(): Response
    {
        $landingData = LandingContent::current();
        $user = \Illuminate\Support\Facades\Auth::user();

        return Inertia::render('LandingPage', [
            'landingData' => $landingData,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                ] : null,
            ],
        ]);
    }

    public function speaker(): Response
    {
        return $this->renderPage('SpeakerPage');
    }

    public function timeline(): Response
    {
        return $this->renderPage('TimelinePage');
    }

    public function pricing(): Response
    {
        $landingData = LandingContent::current();
        $user = auth()->user();
        $ticketPricing = \App\Models\TicketPricing::all();

        return Inertia::render('PricingPage', [
            'landingData' => $landingData,
            'ticketPricing' => $ticketPricing,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                ] : null,
            ],
        ]);
    }

    private function renderPage(string $page): Response
    {
        $landingData = LandingContent::current();
        $user = auth()->user();

        return Inertia::render($page, [
            'landingData' => $landingData,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                ] : null,
            ],
        ]);
    }
}

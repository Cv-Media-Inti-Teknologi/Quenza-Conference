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

        return Inertia::render('LandingPage', [
            'landingData' => $landingData,
        ]);
    }
}

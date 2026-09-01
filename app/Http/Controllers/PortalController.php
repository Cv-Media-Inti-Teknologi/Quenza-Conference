<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    /**
     * Display a simple dashboard / success login page for non-super_admin roles.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Portal/Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'is_verified' => (bool) $user->is_verified,
                'status' => $user->status,
                'avatar' => $user->avatar,
                'institution' => $user->institution,
                'phone' => $user->phone,
                'expertise' => $user->expertise,
            ],
        ]);
    }
}

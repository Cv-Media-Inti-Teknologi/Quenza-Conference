<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of all users for admin management.
     */
    public function index(Request $request): Response
    {
        $users = User::select([
            'id',
            'name',
            'username',
            'email',
            'role',
            'is_verified',
            'status',
            'avatar',
            'institution',
            'phone',
            'expertise',
            'created_at',
        ])
        ->orderBy('id', 'asc')
        ->get();

        $stats = [
            'total' => $users->count(),
            'participants' => $users->where('role', 'participant')->count(),
            'authors' => $users->where('role', 'author')->count(),
            'reviewers' => $users->where('role', 'reviewer')->count(),
            'verified' => $users->where('is_verified', true)->count(),
            'non_verified' => $users->where('is_verified', false)->count(),
            'active' => $users->where('status', 'active')->count(),
            'blocked' => $users->where('status', 'blocked')->count(),
        ];

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'stats' => $stats,
        ]);
    }

    /**
     * Update user details and role.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'in:participant,author,reviewer,super_admin'],
            'institution' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'expertise' => ['nullable', 'string', 'max:500'],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', "Data pengguna '{$user->name}' berhasil diperbarui.");
    }

    /**
     * Toggle user verification status (Verified <-> Non-Verified).
     */
    public function toggleVerification(User $user): RedirectResponse
    {
        $user->is_verified = !$user->is_verified;
        $user->save();

        $statusLabel = $user->is_verified ? 'Verified' : 'Non-Verified';

        return redirect()->back()->with('success', "Status verifikasi akun {$user->name} berhasil diubah menjadi {$statusLabel}.");
    }

    /**
     * Toggle user access status (Active <-> Blocked).
     */
    public function toggleStatus(User $user): RedirectResponse
    {
        // Safety guard: prevent self-blocking
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat memblokir akun Anda sendiri.');
        }

        $user->status = ($user->status === 'active') ? 'blocked' : 'active';
        $user->save();

        $statusLabel = ($user->status === 'active') ? 'diaktifkan kembali (Active)' : 'diblokir (Blocked)';

        return redirect()->back()->with('success', "Akses akun {$user->name} berhasil {$statusLabel}.");
    }
}

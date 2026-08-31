<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $input = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required'],
        ]);

        $loginType = filter_var($input['username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [
            $loginType => $input['username'],
            'password' => $input['password'],
        ];

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();

            if ($user->isBlocked()) {
                Auth::logout();
                return back()->withErrors([
                    'username' => 'Akun Anda telah dinonaktifkan atau diblokir oleh Administrator.',
                ]);
            }

            $request->session()->regenerate();

            if ($user->isSuperAdmin()) {
                return redirect()->intended('/admin/dashboard');
            }

            if ($user->isReviewer()) {
                return redirect()->intended('/reviewer/dashboard');
            }

            return redirect('/portal');
        }

        return back()->withErrors([
            'username' => 'Nama pengguna atau kata sandi salah.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}

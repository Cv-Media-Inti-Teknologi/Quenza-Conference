<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'username'    => ['required', 'string', 'max:255', 'unique:users,username'],
            'phone'       => ['required', 'string', 'max:20'],
            'email'       => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'institution' => ['required', 'string', 'max:255'],
            'password'    => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/',
            ],
        ], [
            'password.regex' => 'Kata sandi wajib mengandung huruf besar, huruf kecil, angka, dan simbol.',
        ]);

        $user = User::create([
            'name'        => $validated['username'],
            'username'    => $validated['username'],
            'phone'       => $validated['phone'],
            'email'       => $validated['email'],
            'institution' => $validated['institution'],
            'password'    => Hash::make($validated['password']),
            'role'        => 'participant',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/');
    }
}
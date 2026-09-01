import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        phone: '',
        email: '',
        insrtitution: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="bg-quenza-bg flex items-center justify-center min-h-screen p-4 font-sans selection:bg-quenza-primary selection:text-white antialiased">
            <Head title="Daftar - Quenza Conference System" />

            <div className="bg-white rounded-quenza-2xl shadow-quenza-modal flex flex-col md:flex-row w-full max-w-4xl overflow-hidden min-h-[560px] border border-gray-100 relative animate-fadeIn">

                {/* Left Panel: Brand & Illustration */}
                <div className="bg-quenza-light w-full md:w-1/2 p-10 flex flex-col items-center justify-center relative">
                    <Link
                        href="/"
                        className="text-center group flex flex-col items-center focus:outline-none"
                        title="Kembali ke Landing Page"
                    >
                        <div className="w-14 h-14 rounded-quenza-xl bg-quenza-secondary flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-quenza-3xlarge font-quenza-bold text-quenza-text-primary tracking-tight font-sans">
                            Quenza
                        </h1>
                        <span className="text-quenza-small font-mono tracking-widest text-quenza-secondary uppercase font-quenza-semibold mt-0.5">
                            Conference System
                        </span>
                    </Link>

                    <div className="mt-8 max-w-[280px] w-full text-center">
                        <div className="border border-quenza-secondary/20 rounded-quenza-xl p-5 bg-white/40 backdrop-blur-xs shadow-2xs">
                            <p className="text-quenza-medium font-quenza-semibold text-quenza-secondary leading-snug">
                                Selamat Datang di Quenza
                            </p>
                            <p className="text-quenza-small text-gray-600 mt-2">
                                Daftar untuk mulai mengelola paper, jadwal, dan keikutsertaan konferensi Anda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Register Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white relative">
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-quenza-small font-quenza-medium text-gray-500 hover:text-quenza-secondary transition-colors group px-3 py-1.5 rounded-lg hover:bg-gray-50 -ml-3"
                        >
                            <svg
                                className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gray-400 group-hover:text-quenza-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-[340px] mx-auto">
                        <div className="mb-7">
                            <h2 className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary tracking-tight">
                                Selamat Datang
                            </h2>
                            <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-1">
                                Lengkapi data di bawah untuk membuat akun baru
                            </p>
                        </div>

                        {/*Username*/}
                        <div className="mb-5">
                            <label htmlFor="username" className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                Nama Pengguna
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="Masukkan Nama Pengguna"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-quenza-lg focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium placeholder-gray-400 text-quenza-text-primary transition-all bg-gray-50/50 focus:bg-white"
                                disabled={processing}
                                required
                            />
                            {errors.username && (
                                <p className="text-quenza-small font-quenza-medium text-quenza-danger mt-1.5">{errors.username}</p>
                            )}
                        </div>

                        {/*Nomor Telepon*/}
                        <div className="mb-5">
                            <label htmlFor="phone" className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                Nomor Telepon
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Masukkan Nomor Telepon"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-quenza-lg focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium placeholder-gray-400 text-quenza-text-primary transition-all bg-gray-50/50 focus:bg-white"
                                disabled={processing}
                                required
                            />
                            {errors.phone && (
                                <p className="text-quenza-small font-quenza-medium text-quenza-danger mt-1.5">{errors.phone}</p>
                            )}
                        </div>

                        {/*Email*/}
                        <div className="mb-5">
                            <label htmlFor="email" className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan Email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-quenza-lg focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium placeholder-gray-400 text-quenza-text-primary transition-all bg-gray-50/50 focus:bg-white"
                                disabled={processing}
                                required
                            />
                            {errors.email && (
                                <p className="text-quenza-small font-quenza-medium text-quenza-danger mt-1.5">{errors.email}</p>
                            )}
                        </div>
                        
                        {/* Institusi / Universitas */}
                        <div className="mb-5">
                            <label htmlFor="institution" className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                Institusi / Universitas
                            </label>
                            <input
                                type="text"
                                id="institution"
                                value={data.institution}
                                onChange={(e) => setData('institution', e.target.value)}
                                placeholder="Masukkan Nama Institusi / Universitas"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-quenza-lg focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium placeholder-gray-400 text-quenza-text-primary transition-all bg-gray-50/50 focus:bg-white"
                                disabled={processing}
                                required
                            />
                            {errors.institution && (
                                <p className="text-quenza-small font-quenza-medium text-quenza-danger mt-1.5">{errors.institution}</p>
                            )}
                        </div>

                        {/*Password*/}
                        <div className="mb-5">
                            <label htmlFor="password" className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan Kata Sandi"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-quenza-lg focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium pr-11 placeholder-gray-400 text-quenza-text-primary transition-all bg-gray-50/50 focus:bg-white"
                                    disabled={processing}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                                    title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        ) : (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-quenza-small font-quenza-medium text-quenza-danger mt-1.5">{errors.password}</p>
                            )}
                            <p className="text-quenza-small text-gray-500 mt-1.5">
                                Minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
                                </p>
                        </div>

                        {/* Konfirmasi Kata Sandi */}
                        <div className="mb-8">
                            <label htmlFor="password_confirmation" className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Masukkan Kembali Kata Sandi"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-quenza-lg focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium pr-11 placeholder-gray-400 text-quenza-text-primary transition-all bg-gray-50/50 focus:bg-white"
                                    disabled={processing}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                                    title={showPasswordConfirm ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                                        {showPasswordConfirm ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        ) : (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-quenza-small font-quenza-medium text-quenza-danger mt-1.5">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="quenza-btn-secondary w-full py-3 px-4 rounded-quenza-lg font-quenza-semibold text-quenza-large flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer"
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Daftar'}
                        </button>

                        <p className="text-center text-quenza-small text-gray-600 mt-6">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-quenza-secondary font-quenza-semibold hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
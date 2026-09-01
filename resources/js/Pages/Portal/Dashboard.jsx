import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({ user }) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        router.post('/logout', {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                setIsLogoutModalOpen(false);
            },
        });
    };

    const getRoleInfo = (role) => {
        switch (role) {
            case 'super_admin':
                return {
                    label: 'Super Admin',
                    badgeClass: 'quenza-badge-role-admin',
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    desc: 'Anda memiliki akses penuh untuk mengelola konfigurasi, pengguna, jadwal, dan CMS konferensi.',
                };
            case 'reviewer':
                return {
                    label: 'Reviewer / Mitra Bestari',
                    badgeClass: 'quenza-badge-role',
                    color: 'text-indigo-600',
                    bgColor: 'bg-indigo-50',
                    desc: 'Anda memiliki hak akses untuk menelaah naskah (*blind review*), memberikan skor kuantitatif (1-5), serta catatan evaluasi paper.',
                };
            case 'author':
                return {
                    label: 'Author / Pemakalah',
                    badgeClass: 'quenza-badge-role',
                    color: 'text-teal-600',
                    bgColor: 'bg-teal-50',
                    desc: 'Anda dapat mengunggah abstrak, naskah lengkap (Full Paper), revisi camera-ready, dan memantau status telaah secara berkala.',
                };
            case 'participant':
                return {
                    label: 'Participant / Peserta',
                    badgeClass: 'quenza-badge-role',
                    color: 'text-sky-600',
                    bgColor: 'bg-sky-50',
                    desc: 'Anda terdaftar sebagai peserta konferensi untuk menghadiri sesi pleno, paralel hybrid, dan menerima sertifikat kehadiran digital.',
                };
            default:
                return {
                    label: role,
                    badgeClass: 'quenza-badge-role',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    desc: 'Akun Anda aktif dalam sistem Quenza Conference.',
                };
        }
    };

    const roleInfo = getRoleInfo(user?.role);

    return (
        <div className="min-h-screen bg-quenza-bg text-quenza-text-primary flex flex-col font-sans selection:bg-quenza-primary selection:text-white antialiased">
            <Head title={`Berhasil Login - ${roleInfo.label}`} />

            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-quenza-md bg-quenza-secondary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary tracking-tight">Quenza</span>
                            <span className="text-quenza-small font-mono tracking-widest text-quenza-secondary block uppercase">Conference System</span>
                        </div>
                    </Link>

                    {/* Right Profile & Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="hidden sm:inline-flex text-quenza-medium font-quenza-medium text-gray-600 hover:text-quenza-secondary transition-colors"
                        >
                            Landing Page
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="quenza-btn-outline px-4 py-2 rounded-quenza-md text-quenza-small font-quenza-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Keluar (Logout)</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-6">
                {/* Success Banner Card */}
                <div className="bg-white rounded-quenza-2xl border border-gray-200 shadow-sm p-6 sm:p-10 flex flex-col items-center text-center">
                    {/* Success Icon */}
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mb-5 shadow-xs animate-scaleUp">
                        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-quenza-small font-quenza-semibold mb-3 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Otentikasi Berhasil</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-quenza-bold text-gray-900 tracking-tight">
                        Berhasil Login sebagai <span className="text-quenza-secondary">{roleInfo.label}</span>
                    </h1>

                    <p className="text-quenza-medium text-gray-600 max-w-xl mt-3 leading-relaxed">
                        {roleInfo.desc}
                    </p>

                    {/* Account Details Box */}
                    <div className="w-full mt-8 bg-gray-50/80 rounded-quenza-xl border border-gray-200/90 p-5 sm:p-6 text-left">
                        <h2 className="text-quenza-medium font-quenza-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
                            <span>Informasi Akun Anda</span>
                            <span className={roleInfo.badgeClass}>{roleInfo.label}</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-quenza-medium">
                            <div>
                                <span className="text-quenza-small font-quenza-medium text-gray-500 block">Nama Lengkap</span>
                                <span className="font-quenza-semibold text-gray-900">{user?.name || '-'}</span>
                            </div>

                            <div>
                                <span className="text-quenza-small font-quenza-medium text-gray-500 block">Alamat Email</span>
                                <span className="font-quenza-semibold text-gray-900">{user?.email || '-'}</span>
                            </div>

                            <div>
                                <span className="text-quenza-small font-quenza-medium text-gray-500 block">Nama Pengguna (Username)</span>
                                <span className="font-quenza-semibold text-gray-900">@{user?.username || '-'}</span>
                            </div>

                            <div>
                                <span className="text-quenza-small font-quenza-medium text-gray-500 block">Institusi / Universitas</span>
                                <span className="font-quenza-semibold text-gray-900">{user?.institution || '-'}</span>
                            </div>

                            <div>
                                <span className="text-quenza-small font-quenza-medium text-gray-500 block">Status Verifikasi</span>
                                <span className="mt-1 inline-block">
                                    {user?.is_verified ? (
                                        <span className="quenza-badge-verified">Verified</span>
                                    ) : (
                                        <span className="quenza-badge-unverified">Non-Verified</span>
                                    )}
                                </span>
                            </div>

                            <div>
                                <span className="text-quenza-small font-quenza-medium text-gray-500 block">Status Akses Akun</span>
                                <span className="mt-1 inline-block">
                                    {user?.status === 'blocked' ? (
                                        <span className="quenza-badge-blocked">Blocked</span>
                                    ) : (
                                        <span className="quenza-badge-active">Active</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                        {user?.role === 'super_admin' && (
                            <Link
                                href="/admin/dashboard"
                                className="quenza-btn-secondary px-6 py-3 rounded-quenza-lg text-quenza-medium font-quenza-semibold text-white shadow-sm hover:brightness-105 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <span>Buka Panel Admin</span>
                            </Link>
                        )}

                        <Link
                            href="/"
                            className="quenza-btn-outline px-6 py-3 rounded-quenza-lg text-quenza-medium font-quenza-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-2xs"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Kembali ke Halaman Utama (Landing Page)</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="bg-quenza-danger text-white hover:bg-red-700 px-6 py-3 rounded-quenza-lg text-quenza-medium font-quenza-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Keluar (Logout)</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
                    <div
                        className="bg-white rounded-quenza-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-7 flex flex-col gap-5 relative text-quenza-text-primary animate-scaleUp"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header with Danger Icon */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border bg-red-50 border-red-200 text-red-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-quenza-xlarge font-quenza-bold text-gray-900 leading-snug">
                                    Konfirmasi Keluar (Logout)
                                </h3>
                                <p className="text-quenza-small text-gray-600 mt-1.5 leading-relaxed">
                                    Apakah Anda yakin ingin keluar dari akun ini? Sesi login Anda akan diakhiri dan Anda akan dialihkan ke halaman login.
                                </p>
                            </div>
                        </div>

                        {/* User preview */}
                        <div className="bg-gray-50/90 rounded-quenza-lg p-3.5 border border-gray-200 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 shrink-0 bg-gray-200">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-quenza-semibold text-gray-900 truncate text-quenza-medium">{user?.name}</h4>
                                <p className="text-quenza-small text-gray-500 truncate">{user?.email || 'Akun Aktif'}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsLogoutModalOpen(false)}
                                disabled={isLoggingOut}
                                className="quenza-btn-outline text-quenza-medium font-quenza-medium px-5 py-2.5 rounded-quenza-md hover:bg-gray-100 border border-gray-300 text-gray-700 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                disabled={isLoggingOut}
                                className="bg-quenza-danger hover:bg-red-700 text-white font-quenza-semibold text-quenza-medium px-5 py-2.5 rounded-quenza-md transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Keluar...
                                    </>
                                ) : (
                                    'Ya, Keluar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

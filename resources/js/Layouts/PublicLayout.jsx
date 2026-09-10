import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

/**
 * Layout untuk halaman user non-admin (Author, Reviewer, Participant).
 * Header publik konsisten dengan LandingPage — bukan sidebar admin.
 */
export default function PublicLayout({ children, title = '', subtitle = '' }) {
    const { auth } = usePage().props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const user = auth?.user;

    const navLinks = [
        { href: '/', label: 'Tentang' },
        { href: '/speaker', label: 'Pembicara' },
        { href: '/timeline', label: 'Linimasa' },
        { href: '/pricing', label: 'Paket Registrasi' },
    ];

    return (
        <div className="min-h-screen bg-quenza-bg text-quenza-text-primary flex flex-col font-sans antialiased">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-quenza-md bg-quenza-secondary flex items-center justify-center text-white shadow-xs">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary tracking-tight">Quenza</span>
                            <span className="text-quenza-small font-mono tracking-widest text-quenza-secondary block uppercase">Conference</span>
                        </div>
                    </Link>

                    {/* Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-quenza-medium font-quenza-medium text-gray-600">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-quenza-secondary transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        {user?.role === 'super_admin' && (
                            <Link href="/admin/dashboard" className="hover:text-quenza-secondary transition-colors">
                                Panel Admin
                            </Link>
                        )}
                    </nav>

                    {/* Auth CTA */}
                    {user ? (
                        <div className="flex items-center gap-3 relative">
                            <button
                                type="button"
                                onClick={() => setShowUserMenu((prev) => !prev)}
                                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 bg-gray-200 shrink-0">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600 font-quenza-bold text-quenza-small">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <span className="text-quenza-small font-quenza-semibold text-gray-700 hidden sm:inline">
                                    {user.name}
                                </span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-quenza-lg border border-gray-200 shadow-lg py-2 z-50">
                                    {user.role === 'super_admin' && (
                                        <Link href="/admin/dashboard" className="block px-4 py-2 text-quenza-small text-gray-700 hover:bg-gray-50">
                                            Panel Admin
                                        </Link>
                                    )}
                                    <Link href="/portal" className="block px-4 py-2 text-quenza-small text-gray-700 hover:bg-gray-50">
                                        Dashboard Saya
                                    </Link>
                                    <Link href="/profile" className="block px-4 py-2 text-quenza-small text-gray-700 hover:bg-gray-50">
                                        Profil Saya
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => router.post('/logout')}
                                        className="w-full text-left px-4 py-2 text-quenza-small text-red-600 hover:bg-red-50 cursor-pointer"
                                    >
                                        Keluar (Logout)
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-5 py-2.5 rounded-quenza-md text-quenza-medium font-quenza-semibold text-gray-700 hover:bg-gray-100/80 transition-colors">
                                Masuk
                            </Link>
                            <Link href="/register" className="quenza-btn-secondary text-quenza-medium font-quenza-semibold px-5 py-2.5 rounded-quenza-md text-white shadow-xs hover:brightness-105 transition-all">
                                Daftar Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1">
                {(title || subtitle) && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                        {title && <h1 className="text-2xl font-quenza-bold text-gray-900">{title}</h1>}
                        {subtitle && <p className="text-quenza-medium text-gray-600 mt-1">{subtitle}</p>}
                    </div>
                )}
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-quenza-active text-gray-400 py-8 border-t border-white/10 text-quenza-small">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-quenza-primary flex items-center justify-center text-gray-900 font-quenza-bold">Q</div>
                        <span className="text-white font-quenza-bold text-quenza-large">Quenza Conference System</span>
                    </div>
                    <p>© 2026 Quenza Conference System.</p>
                </div>
            </footer>
        </div>
    );
}

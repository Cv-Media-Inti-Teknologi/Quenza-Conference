import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function TimelinePage({ landingData, auth }) {
    const dates = Array.isArray(landingData?.important_dates) ? landingData.important_dates : [];

    return (
        <div className="min-h-screen bg-quenza-bg text-quenza-text-primary flex flex-col font-sans selection:bg-quenza-primary selection:text-white antialiased">
            <Head>
                <title>Timeline | Quenza Conference</title>
                <meta name="description" content="Jadwal penting Quenza Conference." />
            </Head>

            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-quenza-md bg-quenza-secondary flex items-center justify-center text-white shadow-xs">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary tracking-tight">Quenza</span>
                            <span className="text-quenza-small font-mono tracking-widest text-quenza-secondary block uppercase">Conference</span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-quenza-medium font-quenza-medium text-gray-600">
                        <Link href="/" className="hover:text-quenza-secondary transition-colors">Tentang</Link>
                        <Link href="/speaker" className="hover:text-quenza-secondary transition-colors">Pembicara</Link>
                        <Link href="/timeline" className="text-quenza-secondary font-quenza-semibold">Linimasa</Link>
                        <Link href="/pricing" className="hover:text-quenza-secondary transition-colors">Paket Registrasi</Link>
                        <a href="/#sponsors" className="hover:text-quenza-secondary transition-colors">Sponsor</a>
                    </nav>

                    {auth?.user ? (
                        <div className="flex items-center gap-3 relative">
                            <Link href="/portal" className="hidden sm:inline-flex quenza-btn-outline text-quenza-medium font-quenza-semibold px-5 py-2.5 rounded-quenza-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                                Pantau Hasil Paper
                            </Link>
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="px-4 py-2 rounded-quenza-md bg-quenza-secondary text-white text-quenza-medium font-quenza-semibold shadow-xs hover:brightness-105"
                            >
                                Keluar
                            </button>
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

            <main className="flex-1">
                <section className="py-20 bg-white border-t border-gray-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-widest bg-green-100/70 px-3.5 py-1 rounded-full border border-green-200">
                                Tahapan Konferensi
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-quenza-bold text-gray-900 mt-3">
                                Linimasa &amp; Tanggal Penting
                            </h1>
                            <p className="text-quenza-medium text-gray-600 mt-3">
                                Catat tenggat waktu penting agar tidak melewatkan kesempatan partisipasi.
                            </p>
                        </div>

                        <div className="relative border-l-2 border-green-200 ml-4 sm:ml-32 space-y-10">
                            {dates.map((dateItem, idx) => {
                                const statusBadge = {
                                    completed: { label: 'Selesai', bg: 'bg-green-100 text-green-800' },
                                    active: { label: 'Sedang Berlangsung', bg: 'bg-emerald-600 text-white font-quenza-bold' },
                                    upcoming: { label: 'Mendatang', bg: 'bg-gray-100 text-gray-600' },
                                }[dateItem.status] || { label: 'Mendatang', bg: 'bg-gray-100 text-gray-600' };

                                return (
                                    <div key={dateItem.id || idx} className="relative pl-6 sm:pl-8 group">
                                        <div className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-xs font-quenza-bold text-quenza-small ${
                                            dateItem.status === 'completed'
                                                ? 'bg-quenza-primary text-white'
                                                : dateItem.status === 'active'
                                                ? 'bg-quenza-secondary text-white'
                                                : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {idx + 1}
                                        </div>

                                        <div className="bg-quenza-bg p-6 rounded-quenza-xl border border-gray-200 shadow-2xs hover:border-quenza-secondary transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <h3 className="text-quenza-large font-quenza-bold text-gray-900">
                                                    {dateItem.title}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-quenza-medium font-quenza-bold text-quenza-secondary bg-green-50 px-3 py-1 rounded-quenza-md border border-green-200/60">
                                                        {dateItem.date_info}
                                                    </span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-quenza-small ${statusBadge.bg}`}>
                                                        {statusBadge.label}
                                                    </span>
                                                </div>
                                            </div>
                                            {dateItem.description && (
                                                <p className="text-quenza-medium text-gray-600 mt-2">
                                                    {dateItem.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-quenza-active text-gray-400 py-10 border-t border-white/10 text-quenza-small">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-quenza-primary flex items-center justify-center text-gray-900 font-quenza-bold">Q</div>
                        <span className="text-white font-quenza-bold text-quenza-large">Quenza Conference System</span>
                    </div>
                    <p>© 2026 Quenza Conference System. Dikembangkan untuk Konsorsium Perguruan Tinggi Nasional.</p>
                </div>
            </footer>
        </div>
    );
}

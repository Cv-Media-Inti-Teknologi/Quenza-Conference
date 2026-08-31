import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function SpeakerPage({ landingData, auth }) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');

    const speakers = Array.isArray(landingData?.speakers) ? landingData.speakers : [];
    const filters = ['Semua', 'Keynote', 'Invited', 'Panel', 'Workshop'];

    const filteredSpeakers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return speakers.filter((speaker) => {
            const role = (speaker.role || '').toLowerCase();
            const name = (speaker.name || '').toLowerCase();
            const affiliation = (speaker.affiliation || '').toLowerCase();
            const expertise = (speaker.expertise || '').toLowerCase();

            const matchesFilter = activeFilter === 'Semua' || role.includes(activeFilter.toLowerCase());
            const matchesSearch =
                !query ||
                name.includes(query) ||
                affiliation.includes(query) ||
                expertise.includes(query) ||
                role.includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, search, speakers]);

    return (
        <div className="min-h-screen bg-quenza-bg text-quenza-text-primary flex flex-col font-sans selection:bg-quenza-primary selection:text-white antialiased">
            <Head>
                <title>Speaker | Quenza Conference</title>
                <meta name="description" content="Daftar pembicara utama Quenza Conference." />
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
                        <Link href="/speaker" className="text-quenza-secondary font-quenza-semibold">Pembicara</Link>
                        <Link href="/timeline" className="hover:text-quenza-secondary transition-colors">Linimasa</Link>
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
                <section className="py-20 bg-quenza-bg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-widest bg-green-100/70 px-3.5 py-1 rounded-full border border-green-200">
                                Narasumber Terkemuka
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-quenza-bold text-gray-900 mt-3">
                                Keynote &amp; Featured Speakers
                            </h1>
                            <p className="text-quenza-medium text-gray-600 mt-3">
                                Para pembicara kunci internasional yang akan membagikan wawasan mendalam mengenai tren riset terkini.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto mb-8">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="6" strokeWidth="2"/>
                                    <path d="M16 16L21 21" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari pembicara, bidang, atau institusi..."
                                    className="w-full rounded-quenza-xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-quenza-medium text-gray-700 shadow-2xs focus:border-quenza-primary focus:ring-2 focus:ring-green-200 outline-none"
                                />
                            </div>
                        </div>

                        <div className="max-w-5xl mx-auto mb-10 flex flex-wrap gap-3 justify-center">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 rounded-full border text-quenza-medium font-quenza-medium transition-all ${
                                        activeFilter === filter
                                            ? 'bg-quenza-secondary text-white border-quenza-secondary shadow-xs'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-quenza-secondary hover:text-quenza-secondary'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {filteredSpeakers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {filteredSpeakers.map((speaker, index) => (
                                    <div
                                        key={speaker.id || index}
                                        className="bg-white rounded-quenza-2xl border border-gray-200 p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
                                    >
                                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-50 shadow-sm group-hover:scale-105 transition-transform duration-300 mb-5">
                                            <img
                                                src={speaker.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Speaker'}
                                                alt={speaker.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-green-50 text-quenza-secondary font-quenza-bold text-quenza-small mb-2">
                                            {speaker.role || 'Keynote Speaker'}
                                        </span>
                                        <h3 className="text-quenza-xlarge font-quenza-bold text-gray-900">
                                            {speaker.name}
                                        </h3>
                                        <p className="text-quenza-medium font-quenza-medium text-quenza-secondary mt-1">
                                            {speaker.affiliation}
                                        </p>
                                        {speaker.expertise && (
                                            <p className="text-quenza-small text-gray-500 mt-3 bg-gray-50 px-3 py-1.5 rounded-quenza-md border border-gray-100">
                                                Fokus: {speaker.expertise}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-xl mx-auto bg-white border border-dashed border-gray-200 rounded-quenza-2xl text-center py-16 px-6">
                                <p className="text-quenza-large font-quenza-semibold text-gray-700">Tidak ada pembicara yang cocok dengan pencarian Anda.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setActiveFilter('Semua');
                                    }}
                                    className="mt-5 quenza-btn-secondary text-quenza-medium font-quenza-semibold px-5 py-2.5 rounded-quenza-md text-white"
                                >
                                    Reset Pencarian
                                </button>
                            </div>
                        )}
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

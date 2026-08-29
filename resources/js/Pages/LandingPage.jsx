import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function LandingPage({ landingData }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const slides = Array.isArray(landingData?.slider_images) ? landingData.slider_images : [];
    const speakers = Array.isArray(landingData?.speakers) ? landingData.speakers : [];
    const dates = Array.isArray(landingData?.important_dates) ? landingData.important_dates : [];
    const sponsors = Array.isArray(landingData?.sponsors) ? landingData.sponsors : [];

    const nextSlide = () => {
        if (slides.length > 0) {
            setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
        }
    };

    const prevSlide = () => {
        if (slides.length > 0) {
            setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
        }
    };

    return (
        <div className="min-h-screen bg-quenza-bg text-quenza-text-primary flex flex-col font-sans selection:bg-quenza-primary selection:text-white antialiased">
            <Head>
                <title>{landingData?.conference_title || 'Quenza Conference System'}</title>
                <meta name="description" content={landingData?.description || 'Platform Manajemen Konferensi Akademik Terintegrasi berbasis AI'} />
            </Head>

            {/* Header & Navbar */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand */}
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

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-quenza-medium font-quenza-medium text-gray-600">
                        <a href="#about" className="hover:text-quenza-secondary transition-colors">Tentang</a>
                        <a href="#speakers" className="hover:text-quenza-secondary transition-colors">Pembicara</a>
                        <a href="#timeline" className="hover:text-quenza-secondary transition-colors">Linimasa</a>
                        <a href="#pricing" className="hover:text-quenza-secondary transition-colors">Paket Registrasi</a>
                        <a href="#sponsors" className="hover:text-quenza-secondary transition-colors">Sponsor</a>
                    </nav>

                    {/* Auth CTA */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 rounded-quenza-md text-quenza-medium font-quenza-semibold text-gray-700 hover:bg-gray-100/80 transition-colors"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/login"
                            className="quenza-btn-secondary text-quenza-medium font-quenza-semibold px-5 py-2.5 rounded-quenza-md text-white shadow-xs hover:brightness-105 transition-all"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section id="about" className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-linear-to-b from-green-50/60 via-white to-quenza-bg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                        {/* Conference Edition & Date Pill */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-green-100 text-quenza-secondary text-quenza-small font-quenza-semibold mb-6 shadow-2xs border border-green-200">
                            <span className="w-2 h-2 rounded-full bg-quenza-primary animate-pulse"></span>
                            <span>{landingData?.edition || 'Edisi ke-8'}</span>
                            <span>•</span>
                            <span>{landingData?.date_range || '14–15 Okt 2026'}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-quenza-bold text-gray-900 max-w-4xl tracking-tight leading-tight">
                            {landingData?.conference_title || 'International Conference on Information Technology 2026'}
                        </h1>

                        {/* Theme */}
                        <p className="text-quenza-xlarge sm:text-2xl font-quenza-semibold text-quenza-secondary mt-5 max-w-3xl">
                            "{landingData?.conference_theme || 'AI for a Sustainable Future'}"
                        </p>

                        {/* Description */}
                        <p className="text-quenza-large text-gray-600 max-w-2xl mt-5 leading-relaxed">
                            {landingData?.description || 'Konferensi akademik internasional yang mempertemukan peneliti, ilmuwan, praktisi, dan akademisi dari berbagai negara untuk berbagi inovasi terdepan.'}
                        </p>

                        {/* Location Pill */}
                        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white rounded-full border border-gray-200 text-quenza-medium font-quenza-medium text-gray-700 shadow-2xs">
                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{landingData?.location || 'Grand Ballroom, Bali (Hybrid Event)'}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                            <Link
                                href="/login"
                                className="quenza-btn-secondary text-quenza-large font-quenza-semibold px-8 py-3.5 rounded-quenza-lg text-white shadow-md hover:scale-[1.02] transition-all"
                            >
                                Submit Paper Anda
                            </Link>
                            <a
                                href="#timeline"
                                className="quenza-btn-outline text-quenza-large font-quenza-semibold px-8 py-3.5 rounded-quenza-lg border border-gray-300 text-gray-700 hover:bg-white transition-all shadow-xs"
                            >
                                Lihat Linimasa Kegiatan
                            </a>
                        </div>

                        {/* Trust Metrics Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full mt-16 pt-12 border-t border-gray-200/80">
                            <div>
                                <p className="text-quenza-3xlarge font-quenza-bold text-quenza-secondary">800+</p>
                                <p className="text-quenza-small font-quenza-medium text-gray-500 mt-0.5">Peserta Terdaftar</p>
                            </div>
                            <div>
                                <p className="text-quenza-3xlarge font-quenza-bold text-quenza-secondary">500+</p>
                                <p className="text-quenza-small font-quenza-medium text-gray-500 mt-0.5">Paper Terkelola</p>
                            </div>
                            <div>
                                <p className="text-quenza-3xlarge font-quenza-bold text-quenza-secondary">15+</p>
                                <p className="text-quenza-small font-quenza-medium text-gray-500 mt-0.5">Negara Partisipan</p>
                            </div>
                            <div>
                                <p className="text-quenza-3xlarge font-quenza-bold text-quenza-secondary">100%</p>
                                <p className="text-quenza-small font-quenza-medium text-gray-500 mt-0.5">Double-Blind Review</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Banner / Image Slider Section */}
                {slides.length > 0 && (
                    <section className="py-12 bg-white border-y border-gray-200">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative rounded-quenza-2xl overflow-hidden shadow-lg aspect-16/9 md:aspect-21/9 bg-gray-900 group">
                                {slides.map((slide, idx) => (
                                    <div
                                        key={slide.id || idx}
                                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                            idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                        }`}
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.caption || `Slide ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {slide.caption && (
                                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-10 text-white">
                                                <p className="text-quenza-large sm:text-quenza-xlarge font-quenza-bold drop-shadow-sm">
                                                    {slide.caption}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {slides.length > 1 && (
                                    <>
                                        {/* Prev / Next Controls */}
                                        <button
                                            type="button"
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center backdrop-blur-xs transition-all shadow-md"
                                            aria-label="Previous slide"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center backdrop-blur-xs transition-all shadow-md"
                                            aria-label="Next slide"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        {/* Indicators */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                            {slides.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentSlideIndex(idx)}
                                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                        idx === currentSlideIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                                    }`}
                                                    aria-label={`Go to slide ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Keynote & Featured Speakers Section */}
                {speakers.length > 0 && (
                    <section id="speakers" className="py-20 bg-quenza-bg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-3xl mx-auto mb-14">
                                <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-widest bg-green-100/70 px-3.5 py-1 rounded-full border border-green-200">
                                    Narasumber Terkemuka
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-quenza-bold text-gray-900 mt-3">
                                    Keynote & Featured Speakers
                                </h2>
                                <p className="text-quenza-medium text-gray-600 mt-3">
                                    Para pembicara kunci internasional yang akan membagikan wawasan mendalam mengenai tren riset terkini.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {speakers.map((speaker, index) => (
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
                                            {speaker.role}
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
                        </div>
                    </section>
                )}

                {/* Important Dates / Linimasa Section */}
                {dates.length > 0 && (
                    <section id="timeline" className="py-20 bg-white border-t border-gray-200">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-3xl mx-auto mb-14">
                                <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-widest bg-green-100/70 px-3.5 py-1 rounded-full border border-green-200">
                                    Tahapan Konferensi
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-quenza-bold text-gray-900 mt-3">
                                    Linimasa & Tanggal Penting
                                </h2>
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
                                            {/* Step dot */}
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
                )}

                {/* Pricing / Registration Packages */}
                <section id="pricing" className="py-20 bg-quenza-bg border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-widest bg-green-100/70 px-3.5 py-1 rounded-full border border-green-200">
                                Investasi Partisipasi
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-quenza-bold text-gray-900 mt-3">
                                Paket Registrasi & Tiket
                            </h2>
                            <p className="text-quenza-medium text-gray-600 mt-3">
                                Pilihan paket partisipasi untuk Pemakalah (Author) dan Peserta (Participant).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Card 1 */}
                            <div className="bg-white rounded-quenza-2xl border border-gray-200 p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                                <div>
                                    <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-wider">
                                        Participant
                                    </span>
                                    <h3 className="text-quenza-2xlarge font-quenza-bold text-gray-900 mt-1">Non-Pemakalah</h3>
                                    <p className="text-quenza-small text-gray-500 mt-1">Akses seluruh sesi plenary & paralel.</p>
                                    <div className="my-6">
                                        <span className="text-quenza-4xlarge font-quenza-bold text-gray-900">Rp 650.000</span>
                                        <span className="text-quenza-small text-gray-500"> / orang</span>
                                    </div>
                                    <ul className="space-y-3 text-quenza-medium text-gray-600 border-t border-gray-100 pt-6">
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Akses Room Hybrid & Offline
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            E-Certificate Kehadiran
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Materi Presentasi & Prosiding
                                        </li>
                                    </ul>
                                </div>
                                <Link href="/login" className="quenza-btn-outline w-full mt-8 py-3 rounded-quenza-lg font-quenza-semibold text-center">
                                    Beli Tiket Peserta
                                </Link>
                            </div>

                            {/* Card 2 - Highlighted */}
                            <div className="bg-white rounded-quenza-2xl border-2 border-quenza-secondary p-8 shadow-xl flex flex-col justify-between relative scale-105">
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-quenza-secondary text-white px-4 py-1 rounded-full text-quenza-small font-quenza-bold tracking-wider uppercase">
                                    Rekomendasi Author
                                </div>
                                <div>
                                    <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-wider">
                                        Presenter
                                    </span>
                                    <h3 className="text-quenza-2xlarge font-quenza-bold text-gray-900 mt-1">Pemakalah Reguler</h3>
                                    <p className="text-quenza-small text-gray-500 mt-1">Registrasi 1 naskah paper lolos review.</p>
                                    <div className="my-6">
                                        <span className="text-quenza-4xlarge font-quenza-bold text-gray-900">Rp 1.500.000</span>
                                        <span className="text-quenza-small text-gray-500"> / paper</span>
                                    </div>
                                    <ul className="space-y-3 text-quenza-medium text-gray-600 border-t border-gray-100 pt-6">
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Presentasi Oral / Poster Paralel
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Double-Blind Review & AI Scoring
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Sertifikat Presenter Resmi
                                        </li>
                                    </ul>
                                </div>
                                <Link href="/login" className="quenza-btn-secondary w-full mt-8 py-3 rounded-quenza-lg font-quenza-bold text-center text-white">
                                    Daftar Sebagai Author
                                </Link>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-quenza-2xl border border-gray-200 p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                                <div>
                                    <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-wider">
                                        International
                                    </span>
                                    <h3 className="text-quenza-2xlarge font-quenza-bold text-gray-900 mt-1">Overseas Author</h3>
                                    <p className="text-quenza-small text-gray-500 mt-1">For international participants & authors.</p>
                                    <div className="my-6">
                                        <span className="text-quenza-4xlarge font-quenza-bold text-gray-900">$150 USD</span>
                                        <span className="text-quenza-small text-gray-500"> / paper</span>
                                    </div>
                                    <ul className="space-y-3 text-quenza-medium text-gray-600 border-t border-gray-100 pt-6">
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Online & In-person Presentation
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            International Proceeding
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Online Payment Gateway
                                        </li>
                                    </ul>
                                </div>
                                <Link href="/login" className="quenza-btn-outline w-full mt-8 py-3 rounded-quenza-lg font-quenza-semibold text-center">
                                    Register Overseas
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Partner / Sponsor Section */}
                {sponsors.length > 0 && (
                    <section id="sponsors" className="py-16 bg-white border-t border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <span className="text-quenza-small font-quenza-bold text-gray-500 uppercase tracking-widest block mb-8">
                                Didukung Oleh Sponsor & Mitra Akademik
                            </span>
                            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 max-w-5xl mx-auto">
                                {sponsors.map((sp, idx) => (
                                    <a
                                        key={sp.id || idx}
                                        href={sp.website_url || '#'}
                                        target={sp.website_url ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className="group flex flex-col items-center gap-2 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        <div className="h-14 w-32 flex items-center justify-center p-1">
                                            <img
                                                src={sp.logo}
                                                alt={sp.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <span className="text-quenza-small font-quenza-medium text-gray-600 group-hover:text-quenza-secondary">
                                            {sp.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Footer Banner */}
                <section className="py-16 bg-quenza-sidebar text-white text-center px-4">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <h2 className="text-3xl sm:text-4xl font-quenza-bold">
                            Siap Mempublikasikan Riset Terbaik Anda?
                        </h2>
                        <p className="text-quenza-large text-green-100 mt-3 max-w-xl">
                            Daftarkan diri dan naskah Anda sekarang untuk bergabung dalam konferensi terdepan tahun ini.
                        </p>
                        <Link
                            href="/login"
                            className="mt-8 px-8 py-3.5 bg-quenza-primary hover:brightness-105 text-gray-900 font-quenza-bold rounded-quenza-lg shadow-lg hover:scale-105 transition-all"
                        >
                            Mulai Registrasi Sekarang
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-quenza-active text-gray-400 py-10 border-t border-white/10 text-quenza-small">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-quenza-primary flex items-center justify-center text-gray-900 font-quenza-bold">
                            Q
                        </div>
                        <span className="text-white font-quenza-bold text-quenza-large">Quenza Conference System</span>
                    </div>
                    <p>© 2026 Quenza Conference System. Dikembangkan untuk Konsorsium Perguruan Tinggi Nasional.</p>
                </div>
            </footer>
        </div>
    );
}

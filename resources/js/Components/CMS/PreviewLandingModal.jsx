import React, { useState } from 'react';

export default function PreviewLandingModal({ isOpen, onClose, data }) {
    const [previewMode, setPreviewMode] = useState('mobile'); // default or switchable: desktop, tablet, mobile

    if (!isOpen) return null;

    const slides = Array.isArray(data.slider_images) ? data.slider_images : [];
    const speakers = Array.isArray(data.speakers) ? data.speakers : [];
    const dates = Array.isArray(data.important_dates) ? data.important_dates : [];
    const sponsors = Array.isArray(data.sponsors) ? data.sponsors : [];

    const deviceStyles = {
        desktop: {
            wrapper: 'w-full max-w-5xl h-[78vh]',
            frame: 'rounded-xl border border-gray-300 shadow-2xl',
            inner: 'rounded-xl',
        },
        tablet: {
            wrapper: 'w-full max-w-[768px] h-[78vh]',
            frame: 'rounded-[28px] border-8 border-gray-800 shadow-2xl',
            inner: 'rounded-[20px]',
        },
        mobile: {
            wrapper: 'w-full max-w-[400px] h-[78vh]',
            frame: 'rounded-[40px] border-[10px] border-gray-900 shadow-2xl relative',
            inner: 'rounded-[30px]',
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
            <div className="bg-quenza-bg w-full max-w-7xl h-[94vh] rounded-quenza-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
                {/* Header Control Bar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0 shadow-2xs z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-quenza-secondary flex items-center justify-center font-quenza-bold text-quenza-small border border-emerald-300">
                            LIVE
                        </div>
                        <div>
                            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                                Preview Konten Landing Page
                            </h3>
                            <p className="text-quenza-small text-quenza-text-secondary">
                                Pratinjau interaktif — konten di dalam layar dapat di-scroll ke bawah
                            </p>
                        </div>
                    </div>

                    {/* Device Switcher */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-quenza-lg border border-gray-200">
                        <button
                            type="button"
                            onClick={() => setPreviewMode('desktop')}
                            className={`px-3 py-1.5 rounded-quenza-md text-quenza-small font-quenza-medium transition-all ${
                                previewMode === 'desktop' ? 'bg-white text-quenza-secondary shadow-xs font-quenza-bold' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Desktop
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewMode('tablet')}
                            className={`px-3 py-1.5 rounded-quenza-md text-quenza-small font-quenza-medium transition-all ${
                                previewMode === 'tablet' ? 'bg-white text-quenza-secondary shadow-xs font-quenza-bold' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Tablet
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewMode('mobile')}
                            className={`px-3 py-1.5 rounded-quenza-md text-quenza-small font-quenza-medium transition-all ${
                                previewMode === 'mobile' ? 'bg-white text-quenza-secondary shadow-xs font-quenza-bold' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Mobile
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center gap-1.5 text-quenza-small font-quenza-semibold text-quenza-secondary hover:underline"
                        >
                            Buka di Tab Baru
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Tutup Preview"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Viewport Container */}
                <div className="flex-1 overflow-hidden p-4 sm:p-6 flex items-center justify-center bg-gray-200/80">
                    <div className={`${deviceStyles[previewMode].wrapper} ${deviceStyles[previewMode].frame} bg-white flex flex-col overflow-hidden transition-all duration-300`}>
                        
                        {/* Phone Top Notch for Mobile View */}
                        {previewMode === 'mobile' && (
                            <div className="h-6 bg-gray-900 shrink-0 flex items-center justify-center">
                                <div className="w-24 h-3.5 bg-gray-800 rounded-full"></div>
                            </div>
                        )}

                        {/* Fake Browser Header (Sticky) */}
                        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-5 py-3.5 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-2xs">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-quenza-secondary flex items-center justify-center text-white font-quenza-bold text-xs shadow-2xs">
                                    Q
                                </div>
                                <span className="font-quenza-bold text-gray-900 tracking-tight text-base">Quenza</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="text-quenza-small font-quenza-medium text-gray-600">Masuk</span>
                                <span className="px-3 py-1 bg-quenza-secondary text-white text-quenza-small font-quenza-semibold rounded-quenza-md shadow-2xs">
                                    Daftar
                                </span>
                            </div>
                        </header>

                        {/* Scrollable Landing Page Content Area */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden quenza-scrollbar scroll-smooth bg-quenza-bg">
                            {/* Hero Section */}
                            <section className="bg-linear-to-b from-green-50/70 via-white to-quenza-bg py-10 px-5 text-center flex flex-col items-center border-b border-gray-100">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-quenza-secondary text-quenza-small font-quenza-semibold mb-3 border border-green-200 shadow-2xs">
                                    <span>{data.edition || 'Edisi ke-8'}</span>
                                    <span>•</span>
                                    <span>{data.date_range || '14–15 Okt 2026'}</span>
                                </div>

                                <h1 className="text-xl sm:text-3xl font-quenza-bold text-gray-900 max-w-2xl leading-tight">
                                    {data.conference_title || 'International Conference on Information Technology 2026'}
                                </h1>

                                <p className="text-quenza-medium sm:text-quenza-large font-quenza-semibold text-quenza-secondary mt-2">
                                    "{data.conference_theme || 'AI for a Sustainable Future'}"
                                </p>

                                <p className="text-quenza-small sm:text-quenza-medium text-gray-600 max-w-xl mt-3 leading-relaxed">
                                    {data.description || 'Konferensi akademik internasional yang mempertemukan peneliti dari berbagai negara.'}
                                </p>

                                <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-quenza-small font-quenza-medium text-gray-700 shadow-2xs">
                                    <svg className="w-4 h-4 text-quenza-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{data.location || 'Grand Ballroom, Bali (Hybrid)'}</span>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
                                    <span className="px-5 py-2 bg-quenza-secondary text-white font-quenza-semibold text-quenza-small rounded-quenza-md shadow-xs">
                                        Submit Paper
                                    </span>
                                    <span className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-quenza-semibold text-quenza-small rounded-quenza-md">
                                        Lihat Linimasa
                                    </span>
                                </div>
                            </section>

                            {/* Image Slider Showcase */}
                            {slides.length > 0 && (
                                <section className="p-5 bg-white border-b border-gray-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-3xl mx-auto">
                                        {slides.map((slide, idx) => (
                                            <div key={idx} className="rounded-quenza-lg overflow-hidden border border-gray-200 shadow-2xs bg-gray-50">
                                                <div className="aspect-16/9 bg-gray-100">
                                                    <img src={slide.image} alt={slide.caption} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="p-2.5 text-quenza-small font-quenza-medium text-gray-800 border-t border-gray-100">
                                                    {slide.caption}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Keynote Speakers Section */}
                            {speakers.length > 0 && (
                                <section className="p-6 bg-gray-50/70 border-b border-gray-100">
                                    <div className="text-center mb-5">
                                        <h2 className="text-quenza-large font-quenza-bold text-gray-900">Keynote Speakers</h2>
                                        <p className="text-quenza-small text-gray-500 mt-0.5">Narasumber ahli internasional</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                        {speakers.map((spk, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-quenza-xl border border-gray-200 shadow-2xs flex items-center gap-3.5">
                                                <img src={spk.avatar} alt={spk.name} className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0 shadow-2xs" />
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-quenza-bold text-gray-900 text-quenza-medium truncate">{spk.name}</h3>
                                                    <p className="text-quenza-small text-gray-500 truncate">{spk.affiliation}</p>
                                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-quenza-secondary font-quenza-semibold text-[11px]">
                                                            {spk.role}
                                                        </span>
                                                        {spk.expertise && (
                                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] truncate max-w-[140px]">
                                                                {spk.expertise}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Important Dates / Linimasa */}
                            {dates.length > 0 && (
                                <section className="p-6 bg-white border-b border-gray-100">
                                    <div className="text-center mb-5">
                                        <h2 className="text-quenza-large font-quenza-bold text-gray-900">Linimasa & Tanggal Penting</h2>
                                        <p className="text-quenza-small text-gray-500 mt-0.5">Jadwal pelaksanaan konferensi</p>
                                    </div>
                                    <div className="max-w-xl mx-auto space-y-3">
                                        {dates.map((d, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-quenza-lg border border-gray-200 bg-quenza-bg">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-quenza-bold text-xs ${
                                                    d.status === 'completed' ? 'bg-green-500 text-white' : d.status === 'active' ? 'bg-quenza-secondary text-white' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                        <h4 className="font-quenza-semibold text-gray-900 text-quenza-small truncate">{d.title}</h4>
                                                        <span className="text-[11px] font-quenza-bold text-quenza-secondary bg-green-50 px-2 py-0.5 rounded-md border border-green-200 shrink-0">
                                                            {d.date_info}
                                                        </span>
                                                    </div>
                                                    {d.description && <p className="text-[11px] text-gray-500 mt-0.5">{d.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Sponsor Section */}
                            {sponsors.length > 0 && (
                                <section className="p-6 bg-gray-50 border-b border-gray-100 text-center">
                                    <h3 className="text-quenza-small font-quenza-bold text-gray-500 uppercase tracking-wider mb-4">
                                        Partner & Sponsor
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center gap-6 max-w-2xl mx-auto">
                                        {sponsors.map((sp, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-1">
                                                <div className="h-10 w-24 flex items-center justify-center p-1 bg-white rounded-md border border-gray-200 shadow-2xs">
                                                    <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
                                                </div>
                                                <span className="text-[11px] font-quenza-medium text-gray-500">{sp.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Footer */}
                            <footer className="bg-quenza-sidebar text-white py-6 px-4 text-center text-xs">
                                <p className="font-quenza-medium">© 2026 Quenza Conference System. All rights reserved.</p>
                            </footer>
                        </div>

                        {/* Phone Bottom Home Indicator for Mobile View */}
                        {previewMode === 'mobile' && (
                            <div className="h-5 bg-gray-900 shrink-0 flex items-center justify-center">
                                <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

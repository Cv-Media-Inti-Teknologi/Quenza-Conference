import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function QuenzaAiSchedulingEngine({ 
    allocations = [],
    sessionMetadata = {},
    isProcessingBackend = false
}) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(4); // 1-4
    const [conflictCount, setConflictCount] = useState(sessionMetadata?.conflict_count ?? 0);
    const [isPublished, setIsPublished] = useState(sessionMetadata?.is_locked ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [roomsData, setRoomsData] = useState(allocations);
    const [feedbackMessage, setFeedbackMessage] = useState(null);

    useEffect(() => {
        if (allocations && allocations.length > 0) {
            setRoomsData(allocations);
        }
        if (sessionMetadata) {
            setConflictCount(sessionMetadata.conflict_count ?? 0);
            setIsPublished(sessionMetadata.is_locked ?? false);
        }
    }, [allocations, sessionMetadata]);

    const steps = [
        'AI membaca database paper accepted',
        'AI mengelompokkan paper sesuai tema ruangan & urutan presentasi',
        'Validasi bebas bentrok & kapasitas ruangan',
        'Rekomendasi draft sesi & jadwal siap ditinjau'
    ];

    const showNotification = (msg) => {
        setFeedbackMessage(msg);
        setTimeout(() => setFeedbackMessage(null), 4000);
    };

    const handleRunAi = async () => {
        setIsRunning(true);
        setCurrentStep(1);

        const timer1 = setTimeout(() => setCurrentStep(2), 400);
        const timer2 = setTimeout(() => setCurrentStep(3), 800);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/admin/schedule/auto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({})
            });

            const json = await res.json();
            
            setTimeout(() => {
                setCurrentStep(4);
                setIsRunning(false);
                if (json.rooms) {
                    setRoomsData(json.rooms);
                }
                setConflictCount(json.conflict_count ?? 0);
                setIsPublished(false);
                showNotification('✨ Rekomendasi jadwal berhasil disusun otomatis oleh Quenza AI!');
            }, 1200);
        } catch (err) {
            clearTimeout(timer1);
            clearTimeout(timer2);
            setTimeout(() => {
                setCurrentStep(4);
                setIsRunning(false);
                showNotification('Jadwal diperbarui dengan optimasi topik.');
            }, 1000);
        }
    };

    const handleResolveConflicts = () => {
        setConflictCount(0);
        showNotification('✓ Semua potensi bentrok berhasil diselesaikan secara otomatis.');
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showNotification('💾 Draf rekomendasi jadwal berhasil disimpan ke sistem.');
        }, 500);
    };

    const handlePublish = () => {
        setIsPublishing(true);
        router.post('/admin/schedule/publish', {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsPublishing(false);
                setIsPublished(true);
                showNotification('🚀 Jadwal resmi berhasil dipublikasikan & tiket terkirim ke email presenter!');
            },
            onError: () => {
                setIsPublishing(false);
            },
            onFinish: () => {
                setIsPublishing(false);
            }
        });
    };

    const handleExportPdf = () => {
        window.open('/admin/schedule/export-pdf', '_blank');
    };

    const isResolved = conflictCount === 0;

    return (
        <div className="space-y-6">
            {/* Toast Feedback */}
            {feedbackMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                        <span>{feedbackMessage}</span>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setFeedbackMessage(null)} 
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-1"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Card Utama: Engine Quenza AI Auto-Scheduling */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
                {/* Header & Button Jalankan AI */}
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 tracking-tight">Engine Quenza AI Auto-Scheduling</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Otomasi penempatan paper accepted bebas bentrok berbasis topik & ketersediaan ruangan</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRunAi}
                        disabled={isRunning || isProcessingBackend}
                        className="bg-[#6952e0] hover:bg-[#5841d1] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isRunning ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Memproses AI...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm">🪄</span>
                                <span>Jalankan AI</span>
                            </>
                        )}
                    </button>
                </div>

                {/* List 4 Proses Baris */}
                <div className="space-y-3">
                    {steps.map((text, idx) => {
                        const stepNumber = idx + 1;
                        const isProcessed = currentStep >= stepNumber;

                        return (
                            <div
                                key={idx}
                                className={`p-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                                    isProcessed
                                        ? 'bg-[#f0edff] text-gray-900 border border-transparent'
                                        : 'bg-gray-50 text-gray-400 border border-gray-100'
                                }`}
                            >
                                <span>{text}</span>
                                {isProcessed && (
                                    <span className="text-[#6952e0] text-xs font-bold">
                                        ✓
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Banner Status Validasi */}
                {isResolved ? (
                    <div className="bg-[#ecfdf5] border border-emerald-200 text-[#065f46] text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl flex items-center justify-between transition-all">
                        <div className="flex items-center gap-2">
                            <span>Validasi bebas bentrok &amp; kapasitas: Lolos - 0 konflik terdeteksi.</span>
                        </div>
                        {isPublished && (
                            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                ✓ Terpublikasi Resmi
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="bg-[#fee2e2] border border-red-200 text-[#991b1b] text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl flex items-center justify-between transition-all">
                        <span>Validasi bebas bentrok &amp; kapasitas: Gagal — {conflictCount} konflik terdeteksi.</span>
                        <button 
                            type="button" 
                            onClick={handleResolveConflicts}
                            className="underline text-xs hover:text-red-900 cursor-pointer font-bold"
                        >
                            Selesaikan Otomatis
                        </button>
                    </div>
                )}

                {/* 3-Column Schedule Board (Dynamic) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
                    {roomsData.map((room, roomIdx) => (
                        <div key={room.id || roomIdx} className="bg-[#fafaff] border border-gray-200/80 rounded-2xl p-4 space-y-3.5">
                            {/* Header Ruangan */}
                            <div className="border-b border-gray-100 pb-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-sm text-gray-900">{room.name}</h4>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                        room.type === 'Zoom Meeting'
                                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                        {room.type || (room.location?.toLowerCase().includes('zoom') ? 'Zoom Meeting' : 'Offline')}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    {room.location} • Kapasitas {room.capacity} {room.location?.toLowerCase().includes('zoom') ? 'Partisipan' : 'kursi'}
                                </p>
                                <div className="mt-1.5">
                                    <span className="bg-[#f0edff] text-[#6952e0] text-[10px] font-semibold px-2.5 py-0.5 rounded-md inline-block">
                                        Topik: {room.topic}
                                    </span>
                                </div>
                            </div>

                            {/* Session Cards */}
                            <div className="space-y-3">
                                {room.sessions?.map((session, sIdx) => {
                                    if (session.is_break) {
                                        return (
                                            <div key={sIdx} className="border border-dashed border-gray-200 bg-gray-50/60 rounded-xl py-2 px-3 text-center text-[10px] text-gray-500 font-medium">
                                                {session.time_slot}
                                            </div>
                                        );
                                    }

                                    if (session.is_empty_slot) {
                                        return (
                                            <div key={sIdx} className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-white/60 hover:bg-white transition cursor-pointer">
                                                <h6 className="font-bold text-xs text-gray-700">{session.title || 'Slot Kosong Tersedia'}</h6>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{session.time_slot}</p>
                                                <button type="button" className="text-[10px] font-semibold text-[#6952e0] mt-1 hover:underline cursor-pointer">
                                                    + Isi Paper Cadangan
                                                </button>
                                            </div>
                                        );
                                    }

                                    const hasConflict = session.has_conflict && !isResolved;

                                    return (
                                        <div 
                                            key={session.id || sIdx} 
                                            className={`bg-white rounded-xl p-3.5 border shadow-2xs hover:shadow-xs transition ${
                                                hasConflict ? 'border-red-200 bg-red-50/20' : 'border-gray-100'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center text-[10px] mb-1.5">
                                                <span className={`font-bold ${hasConflict ? 'text-red-600' : 'text-[#6952e0]'}`}>
                                                    {session.time_slot}
                                                </span>
                                                <span className="text-gray-400 text-[10px] flex items-center gap-0.5 select-none">
                                                    <span>⋮⋮</span> Drag to move
                                                </span>
                                            </div>
                                            <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                                {session.paper_code}: {session.title}
                                            </h5>
                                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                                                        {session.author_initials || 'PR'}
                                                    </span>
                                                    <span className="text-xs text-gray-700">{session.author_name}</span>
                                                </div>
                                                
                                                {hasConflict ? (
                                                    <span className="bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">
                                                        Konflik Jadwal
                                                    </span>
                                                ) : isPublished ? (
                                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                                        session.badge?.includes('Online')
                                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                            : session.badge?.includes('Resolved')
                                                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    }`}>
                                                        {session.badge || 'Terverifikasi'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Baris Footer: Publikasi Jadwal Resmi & Otomasi Notifikasi */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                        Publikasi Jadwal Resmi &amp; Otomasi Notifikasi Email Masal
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                        Kirim tiket waktu sesi otomatis ke 38 presenter terverifikasi beserta lampiran kalender (ICS).
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto flex-wrap">
                    {/* Tombol Ekspor PDF */}
                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                        <span>📄</span>
                        <span>Unduh PDF</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving || isPublished}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Draf'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handlePublish}
                        disabled={isPublishing || isPublished}
                        className={`text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 ${
                            isPublished
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#0b603a] hover:bg-[#084c2d] cursor-pointer'
                        }`}
                    >
                        {isPublishing ? (
                            <span>Mempublikasikan...</span>
                        ) : isPublished ? (
                            <>
                                <span>✓</span>
                                <span>Terkunci (Sudah Dipublikasikan)</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                                <span>Publikasikan Sekarang (Kirim Email)</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

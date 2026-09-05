import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function QuenzaAiSchedulingEngine({ 
    recommendations = [],
    isProcessingBackend = false
}) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(4); // default shown as ready or on run
    const [isResolved, setIsResolved] = useState(true); // true = 0 conflict lolos, false = 2 conflict
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const steps = [
        'AI membaca database paper accepted',
        'AI mengelompokkan paper sesuai tema ruangan & urutan presentasi',
        'Validasi bebas bentrok & kapasitas ruangan',
        'Rekomendasi draft sesi & jadwal siap ditinjau'
    ];

    const handleRunAi = () => {
        setIsRunning(true);
        setCurrentStep(1);
        setIsResolved(false);

        setTimeout(() => {
            setCurrentStep(2);
            setTimeout(() => {
                setCurrentStep(3);
                setTimeout(() => {
                    setCurrentStep(4);
                    setIsRunning(false);
                    setIsResolved(true);
                }, 500);
            }, 500);
        }, 500);
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Draf jadwal berhasil disimpan!');
        }, 600);
    };

    const handlePublish = () => {
        setIsPublishing(true);
        router.post('/admin/schedule/publish', {}, {
            preserveScroll: true,
            onFinish: () => setIsPublishing(false)
        });
    };

    return (
        <div className="space-y-6">
            {/* Card Utama: Engine Quenza AI Auto-Scheduling */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
                {/* Header & Button Jalankan AI */}
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-gray-900 tracking-tight">Engine Quenza AI Auto-Scheduling</h3>
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
                    <div className="bg-[#ecfdf5] border border-emerald-200 text-[#065f46] text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2 transition-all">
                        <span>Validasi bebas bentrok &amp; kapasitas: Lolos - 0 konflik terdeteksi.</span>
                    </div>
                ) : (
                    <div className="bg-[#fee2e2] border border-red-200 text-[#991b1b] text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl flex items-center justify-between transition-all">
                        <span>Validasi bebas bentrok &amp; kapasitas: Gagal — 2 konflik terdeteksi.</span>
                        <button 
                            type="button" 
                            onClick={() => setIsResolved(true)}
                            className="underline text-xs hover:text-red-900 cursor-pointer"
                        >
                            Selesaikan Otomatis
                        </button>
                    </div>
                )}

                {/* 3-Column Schedule Board */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
                    {/* Kolom 1: Ruang Garuda */}
                    <div className="bg-[#fafaff] border border-gray-200/80 rounded-2xl p-4 space-y-3.5">
                        {/* Header Ruangan */}
                        <div className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-sm text-gray-900">Ruang Garuda</h4>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                                    Offline
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">Lantai 2, Offline • Kapasitas 120 kursi</p>
                            <div className="mt-1.5">
                                <span className="bg-[#f0edff] text-[#6952e0] text-[10px] font-semibold px-2.5 py-0.5 rounded-md inline-block">
                                    Topik: AI &amp; Machine Learning
                                </span>
                            </div>
                        </div>

                        {/* Session Cards */}
                        <div className="space-y-3">
                            {/* Card 1 */}
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-xs transition">
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className="font-bold text-[#6952e0]">11:00 - 11:40 (40 mnt)</span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    AAI-01: Deep Learning for Early Detection of Cardiac Arrhythmia
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                                            BS
                                        </span>
                                        <span className="text-xs text-gray-700">Dr. Ir. Budi Santoso</span>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">
                                        Terverifikasi
                                    </span>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-xs transition">
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className="font-bold text-[#6952e0]">11:40 - 12:20 (40 mnt)</span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    AAI-08: Transformer Architecture Optimization in Bahasa NLP
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center">
                                            SN
                                        </span>
                                        <span className="text-xs text-gray-700">Siti Nurlaila, M.Cs</span>
                                    </div>
                                    <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100">
                                        Presenter #2
                                    </span>
                                </div>
                            </div>

                            {/* Jeda Istirahat */}
                            <div className="border border-dashed border-gray-200 bg-gray-50/60 rounded-xl py-2 px-3 text-center text-[10px] text-gray-500 font-medium">
                                ☕ 12:20 - 12:35 | Jeda Istirahat &amp; Networking (15 menit)
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-xs transition">
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className="font-bold text-[#6952e0]">12:35 - 13:15 (40 mnt)</span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    AAI-15: Computer Vision in Drone Autonomous Irrigation
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center">
                                            AF
                                        </span>
                                        <span className="text-xs text-gray-700">Ahmad Fauzi, S.T.</span>
                                    </div>
                                    <span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-100">
                                        Paper Mandiri
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom 2: Ruang Kartika */}
                    <div className="bg-[#fafaff] border border-gray-200/80 rounded-2xl p-4 space-y-3.5">
                        {/* Header Ruangan */}
                        <div className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-sm text-gray-900">Ruang Kartika</h4>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                                    Offline
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">Lantai 2, Offline • Kapasitas 80 kursi</p>
                            <div className="mt-1.5">
                                <span className="bg-[#f0edff] text-[#6952e0] text-[10px] font-semibold px-2.5 py-0.5 rounded-md inline-block">
                                    Topik: Software Engineering
                                </span>
                            </div>
                        </div>

                        {/* Session Cards */}
                        <div className="space-y-3">
                            {/* Card 1 */}
                            <div className={`bg-white rounded-xl p-3.5 border shadow-2xs hover:shadow-xs transition ${
                                !isResolved ? 'border-red-200 bg-red-50/20' : 'border-gray-100'
                            }`}>
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className={`font-bold ${!isResolved ? 'text-red-600' : 'text-[#6952e0]'}`}>
                                        11:00 - 12:20 (40 mnt)
                                    </span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    #SE-09: Automated CI/CD Pipelines for Critical Hospital Systems
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                                            BS
                                        </span>
                                        <span className="text-xs text-gray-700">Dr. Ir. Budi Santoso</span>
                                    </div>
                                    {!isResolved ? (
                                        <span className="bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">
                                            Konflik Jadwal
                                        </span>
                                    ) : (
                                        <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100">
                                            ✓ Multi-Paper Resolved
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className={`bg-white rounded-xl p-3.5 border shadow-2xs hover:shadow-xs transition ${
                                !isResolved ? 'border-red-200 bg-red-50/20' : 'border-gray-100'
                            }`}>
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className={`font-bold ${!isResolved ? 'text-red-600' : 'text-[#6952e0]'}`}>
                                        {isResolved ? '12:20 - 13:15 (40 mnt)' : '11:40 - 12:20 (40 mnt)'}
                                    </span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    #SE-18: Refactoring Legacy Monoliths: A Case Study in Fintech
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">
                                            DL
                                        </span>
                                        <span className="text-xs text-gray-700">Dewi Lestari, M.T.</span>
                                    </div>
                                    {!isResolved ? (
                                        <span className="bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">
                                            Konflik Jadwal
                                        </span>
                                    ) : (
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">
                                            Author Solo
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Jeda Istirahat */}
                            <div className="border border-dashed border-gray-200 bg-gray-50/60 rounded-xl py-2 px-3 text-center text-[10px] text-gray-500 font-medium">
                                ☕ 12:20 - 12:35 | Jeda Istirahat &amp; Networking (15 menit)
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-xs transition">
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className="font-bold text-[#6952e0]">13:00 - 13:40 (40 mnt)</span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    #SE-04: Microservices Observability using OpenTelemetry
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                                            RR
                                        </span>
                                        <span className="text-xs text-gray-700">Rizky Ramadhan</span>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">
                                        No Conflict
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom 3: Virtual Room A */}
                    <div className="bg-[#fafaff] border border-gray-200/80 rounded-2xl p-4 space-y-3.5">
                        {/* Header Ruangan */}
                        <div className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-sm text-gray-900">Virtual Room A</h4>
                                <span className="bg-purple-50 text-purple-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-100">
                                    Zoom Meeting
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">Zoom Meeting • Kapasitas 300 Partisipan</p>
                            <div className="mt-1.5">
                                <span className="bg-[#f0edff] text-[#6952e0] text-[10px] font-semibold px-2.5 py-0.5 rounded-md inline-block">
                                    Topik: Hybrid — Data Science &amp; Security
                                </span>
                            </div>
                        </div>

                        {/* Session Cards */}
                        <div className="space-y-3">
                            {/* Card 1 */}
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-xs transition">
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className="font-bold text-[#6952e0]">11:00 - 11:40 (40 mnt)</span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    #DS-02: Zero-Day Intrusion Detection using Graph Neural Networks
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                                            HW
                                        </span>
                                        <span className="text-xs text-gray-700">Prof. Hendra Wijaya</span>
                                    </div>
                                    <span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-100">
                                        Online Speaker
                                    </span>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-xs transition">
                                <div className="flex justify-between items-center text-[10px] mb-1.5">
                                    <span className="font-bold text-[#6952e0]">11:40 - 12:20 (40 mnt)</span>
                                    <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                                        <span>⋮⋮</span> Drag to move
                                    </span>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                    #DS-07: Differential Privacy Framework on Healthcare Datasets
                                </h5>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center">
                                            MP
                                        </span>
                                        <span className="text-xs text-gray-700">Maya Putri, Ph.D</span>
                                    </div>
                                    <span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-100">
                                        Online Speaker
                                    </span>
                                </div>
                            </div>

                            {/* Jeda Istirahat */}
                            <div className="border border-dashed border-gray-200 bg-gray-50/60 rounded-xl py-2 px-3 text-center text-[10px] text-gray-500 font-medium">
                                ☕ 12:20 - 12:35 | Jeda Istirahat &amp; Networking (15 menit)
                            </div>

                            {/* Slot Kosong */}
                            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-white/60 hover:bg-white transition cursor-pointer">
                                <h6 className="font-bold text-xs text-gray-700">Slot Kosong Tersedia</h6>
                                <p className="text-[10px] text-gray-400 mt-0.5">13:00 - 13:15</p>
                                <button type="button" className="text-[10px] font-semibold text-[#6952e0] mt-1 hover:underline">
                                    + Isi Paper Cadangan
                                </button>
                            </div>
                        </div>
                    </div>
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
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Draf'}
                    </button>
                    <button
                        type="button"
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-[#0b603a] hover:bg-[#084c2d] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        <span>{isPublishing ? 'Mempublikasikan...' : 'Publikasikan Sekarang (Kirim Email)'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}


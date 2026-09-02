import React, { useState } from 'react';

export default function QuenzaAiSchedulingEngine({ 
    onApproveDraft = () => {}, 
    recommendations = [],
    isProcessingBackend = false
}) {
    // isRunning: boolean, currentStep: 0 | 1 | 2 | 3 | 4, isCompleted: boolean
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const steps = [
        'AI membaca database paper accepted, ruangan & durasi sesi',
        'AI mengelompokkan paper sesuai tema ruangan & urutan presentasi',
        'Validasi bebas bentrok & kapasitas ruangan',
        'Rekomendasi draft sesi & jadwal siap ditinjau'
    ];

    const defaultRecommendations = [
        { paper: 'Federated Learning for Edge IoT Devices', room: 'Ruang Garuda' },
        { paper: 'Explainable AI in Medical Diagnosis', room: 'Ruang Garuda' },
        { paper: 'Microservice Resilience Patterns', room: 'Ruang Kartika' },
        { paper: 'Real-time Stream Processing at Scale', room: 'Virtual Room A' }
    ];

    const displayRecommendations = recommendations && recommendations.length > 0 
        ? recommendations 
        : defaultRecommendations;

    const handleRunAi = () => {
        setIsRunning(true);
        setCurrentStep(1);
        setIsCompleted(false);

        // Simulasi progress bertahap step 1 -> 2 -> 3 -> 4
        setTimeout(() => {
            setCurrentStep(2);
            setTimeout(() => {
                setCurrentStep(3);
                setTimeout(() => {
                    setCurrentStep(4);
                    setIsRunning(false);
                    setIsCompleted(true);
                }, 700);
            }, 700);
        }, 700);
    };

    return (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6 transition-all duration-300">
            {/* Header & Button Jalankan AI */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-sm text-gray-900">Engine Quenza AI Auto-Scheduling</h3>
                <button
                    type="button"
                    onClick={handleRunAi}
                    disabled={isRunning}
                    className="bg-[#6D5AE0] hover:bg-[#5b48cb] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm w-fit self-start sm:self-auto disabled:opacity-75 disabled:cursor-not-allowed"
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
                            <span>🪄</span>
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
                            className={`p-3.5 rounded-xl text-xs transition-all duration-500 flex items-center justify-between ${
                                isProcessed
                                    ? 'bg-[#ECE9FE] text-purple-900 font-medium border border-purple-200 shadow-2xs'
                                    : 'bg-[#F0FDF4] text-emerald-900 border border-emerald-100'
                            }`}
                        >
                            <span>{text}</span>
                            {isProcessed && (
                                <span className="text-purple-700 text-xs font-bold">
                                    ✓
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Rekomendasi Draft Sesi & Tombol Setujui Draft */}
            {isCompleted && (
                <div className="space-y-4 pt-2 animate-fadeIn transition-all duration-300">
                    {/* Card Rekomendasi Draft Sesi */}
                    <div className="bg-[#F6F5FE] border border-purple-200 rounded-xl p-5">
                        <h4 className="text-xs font-bold text-[#6D5AE0] uppercase tracking-wider mb-3">
                            REKOMENDASI DRAFT SESI
                        </h4>
                        <div className="divide-y divide-purple-100 text-xs">
                            {displayRecommendations.map((item, idx) => (
                                <div key={idx} className="py-2.5 flex justify-between items-center gap-4">
                                    <span className="text-gray-800 font-medium">{item.paper}</span>
                                    <span className="text-[#3B82F6] font-semibold shrink-0">{item.room}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banner Validasi Lolos */}
                    <div className="bg-[#ECFDF5] border border-emerald-200 text-emerald-900 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                        <span>Validasi bebas bentrok & kapasitas: Lolos - 0 konflik terdeteksi.</span>
                    </div>

                    {/* Tombol Setujui Draft AI (Disabled) */}
                    <div>
                        <button
                            type="button"
                            disabled
                            className="bg-[#6D5AE0] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm opacity-60 cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Setujui Draft AI</span>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

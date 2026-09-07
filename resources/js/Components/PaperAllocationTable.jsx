import React, { useState, useEffect } from 'react';

export default function PaperAllocationTable({ 
    allocations = [], 
    isPublished = false, 
    onPublish = () => {},
    processing = false,
    onWorkflowChange = () => {}
}) {
    // stage: 'initial' -> 'validated' -> 'draft_locked' -> 'published'
    const [stage, setStage] = useState(isPublished ? 'published' : 'initial');

    useEffect(() => {
        if (isPublished) {
            setStage('published');
            onWorkflowChange('published');
        }
    }, [isPublished]);

    const handleValidate = () => {
        setStage('validated');
        onWorkflowChange('validated');
    };

    const handleSaveDraft = () => {
        setStage('draft_locked');
        onWorkflowChange('draft_locked');
    };

    const handlePublishEvent = () => {
        setStage('published');
        onWorkflowChange('published');
        onPublish();
    };

    return (
        <div className="space-y-6">
            {/* Section Tabel Alokasi Paper */}
            <section id="allocation-table-section" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="font-bold text-lg text-gray-900">Alokasikan Paper ke Sesi Ruangan</h2>
                        <p className="text-xs text-gray-500">Alokasikan judul paper accepted & author ke sesi sesuai tema ruangan</p>
                    </div>
                    <div 
                        id="validation-badge" 
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                            stage === 'published' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : stage === 'validated' || stage === 'draft_locked'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                        {stage === 'published' 
                            ? 'Jadwal Terpublikasi' 
                            : stage === 'validated' || stage === 'draft_locked'
                                ? 'Tervalidasi' 
                                : 'Draf Belum Divalidasi'}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                                <th className="py-3 px-4">Paper</th>
                                <th className="py-3 px-4">Author</th>
                                <th className="py-3 px-4">Ruangan Ditugaskan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {allocations.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-6 px-4 text-center text-gray-500">
                                        Belum ada alokasi paper. Gunakan metode manual atau Auto-Scheduling AI.
                                    </td>
                                </tr>
                            ) : (
                                allocations.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900">{item.paper}</td>
                                        <td className="py-3 px-4 text-gray-600">{item.author}</td>
                                        <td className="py-3 px-4 text-[#0b603a] font-semibold">{item.room}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Baris Tombol Aksi di Bawah Tabel Alokasi */}
                <div className="mt-6 flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-gray-100" id="action-container">
                    {stage === 'initial' && (
                        <div>
                            <button 
                                type="button"
                                onClick={handleValidate} 
                                id="btn-validasi" 
                                className="border border-emerald-700 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-emerald-50 transition"
                            >
                                Validasi Ulang
                            </button>
                        </div>
                    )}

                    {stage === 'validated' && (
                        <>
                            <button 
                                type="button"
                                disabled
                                id="btn-validasi-disabled" 
                                className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-lg cursor-not-allowed opacity-90 flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Tervalidasi
                            </button>

                            <button 
                                type="button"
                                onClick={handleSaveDraft} 
                                id="btn-save-draft" 
                                className="bg-[#0b603a] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-800 transition shadow-sm"
                            >
                                Simpan dan Setujui Draft Manual
                            </button>
                        </>
                    )}

                    {(stage === 'draft_locked' || stage === 'published') && (
                        <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-emerald-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Data alokasi paper telah tervalidasi oleh sistem.
                        </div>
                    )}
                </div>
            </section>

            {/* Section Baru: Draft Jadwal Final Terkunci */}
            {stage === 'draft_locked' && (
                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300">
                    <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-700">
                        <span className="text-lg shrink-0">🪄</span>
                        <span className="font-medium">Draft Jadwal Final Terkunci — Menunggu konfirmasi publikasi ke presenter & peserta.</span>
                    </div>
                    <button 
                        type="button"
                        onClick={handlePublishEvent} 
                        disabled={processing}
                        className="bg-[#0b603a] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-800 transition whitespace-nowrap shadow-sm"
                    >
                        {processing ? 'Mempublikasikan...' : 'Publikasikan Jadwal Event'}
                    </button>
                </section>
            )}

            {/* Section Baru: Jadwal Terpublikasi */}
            {stage === 'published' && (
                <section className="bg-emerald-50/80 rounded-xl p-6 border border-emerald-200 flex items-center gap-4 transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-emerald-950">Jadwal Terpublikasi</h4>
                        <p className="text-xs text-emerald-800 mt-0.5">Presenter & peserta sudah menerima email jadwal final.</p>
                    </div>
                </section>
            )}
        </div>
    );
}



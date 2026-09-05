import React from 'react';

export default function SchedulingMethodPicker({ activeMethod, setActiveMethod }) {
    const isAiActive = activeMethod === 'ai';

    return (
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 tracking-tight">Pilih Metode Penjadwalan Paper</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-6">
                Alokasikan judul paper accepted &amp; author ke sesi sesuai tema ruangan
            </p>

            <div 
                onClick={() => setActiveMethod && setActiveMethod(isAiActive ? null : 'ai')}
                className={`border rounded-xl p-4 sm:p-5 transition-all cursor-pointer ${
                    isAiActive
                        ? 'bg-[#f4f2ff] border-purple-300 shadow-xs'
                        : 'bg-[#f0f8f4] border-emerald-100/60 hover:bg-[#ebf5ef]'
                }`}
            >
                <div className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
                    <span className="text-base">🪄</span>
                    <span>Auto-Scheduling AI</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 pl-6">
                    Quenza AI membaca database paper &amp; ruangan, lalu menyusun draft jadwal bebas bentrok otomatis.
                </p>
            </div>
        </section>
    );
}




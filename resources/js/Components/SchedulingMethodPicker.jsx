import React from 'react';

export default function SchedulingMethodPicker({ activeMethod, setActiveMethod }) {
    return (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-1">Pilih Metode Penjadwalan Paper</h2>
            <p className="text-xs text-gray-500 mb-4">Alokasikan judul paper accepted & author ke sesi sesuai tema ruangan</p>

            <div className="space-y-3">
                {/* Option: Manual */}
                <div 
                    onClick={() => setActiveMethod('manual')}
                    id="method-manual"
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        activeMethod === 'manual' 
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                    <div className="font-bold text-sm text-gray-900 flex items-center space-x-2">
                        <span>📋</span> 
                        <span className={activeMethod === 'manual' ? 'text-emerald-950 font-semibold' : 'text-gray-900'}>Manual</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        Admin mengalokasikan sendiri judul paper ke sesi & ruangan, lalu divalidasi sistem secara real-time.
                    </p>
                </div>

                {/* Option: Auto-Scheduling AI */}
                <div 
                    onClick={() => setActiveMethod('ai')}
                    id="method-ai"
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        activeMethod === 'ai' 
                            ? 'border-purple-300 bg-[#F5F3FF] shadow-xs' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                    <div className="font-bold text-sm text-gray-900 flex items-center space-x-2">
                        <span>🪄</span> 
                        <span className={activeMethod === 'ai' ? 'text-purple-950 font-semibold' : 'text-gray-900'}>
                            Auto-Scheduling AI
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        Quenza AI membaca database paper & ruangan, lalu menyusun draft jadwal bebas bentrok otomatis.
                    </p>
                </div>
            </div>
        </section>
    );
}


import React from 'react';

export default function PaperAllocationTable({ allocations = [] }) {
    return (
        <div className="quenza-card rounded-quenza-xl mt-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Alokasikan Paper ke Sesi Ruangan</h3>
                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Daftar penempatan paper berdasarkan kesesuaian topik</p>
                </div>
                <span className="quenza-badge-success">
                    {allocations.length > 0 ? `${allocations.length} Terjadwal` : 'Belum Ada Jadwal'}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-quenza-medium">
                    <thead>
                        <tr className="text-[11px] text-quenza-text-secondary uppercase tracking-wider font-quenza-bold border-b border-gray-100 bg-gray-50/75">
                            <th className="py-3.5 px-4">PAPER</th>
                            <th className="py-3.5 px-4">AUTHOR</th>
                            <th className="py-3.5 px-4">RUANGAN DITUGASKAN</th>
                            <th className="py-3.5 px-4">WAKTU SESI</th>
                            <th className="py-3.5 px-4">METODE</th>
                        </tr>
                    </thead>
                    <tbody className="text-quenza-text-primary">
                        {allocations.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-6 px-4 text-center text-quenza-text-secondary">
                                    Belum ada alokasi jadwal. Gunakan tombol "Auto-Scheduling AI" di atas untuk membuat draf jadwal otomatis.
                                </td>
                            </tr>
                        ) : (
                            allocations.map((item, idx) => (
                                <tr key={item.id || idx} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'}`}>
                                    <td className="py-3.5 px-4 font-quenza-semibold">{item.paper}</td>
                                    <td className="py-3.5 px-4 text-quenza-text-secondary font-quenza-regular">{item.author}</td>
                                    <td className="py-3.5 px-4 text-quenza-secondary font-quenza-bold">{item.room}</td>
                                    <td className="py-3.5 px-4 text-quenza-text-secondary font-quenza-medium text-quenza-small">
                                        {item.start_time && item.end_time ? (
                                            <span>
                                                {item.scheduled_date ? `${item.scheduled_date} | ` : ''}
                                                {item.start_time} - {item.end_time}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-quenza-medium ${
                                            item.method === 'Auto-Scheduled AI'
                                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        }`}>
                                            {item.method || 'Manual'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

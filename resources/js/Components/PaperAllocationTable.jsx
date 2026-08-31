import React from 'react';

export default function PaperAllocationTable({ allocations }) {
    return (
        <div id="allocation-table-section" className="quenza-card rounded-quenza-xl mt-6 scroll-mt-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Alokasikan Paper ke Sesi Ruangan</h3>
                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Daftar penempatan paper berdasarkan kesesuaian topik</p>
                </div>
                <span className="quenza-badge-success">Tervalidasi</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-quenza-medium">
                    <thead>
                        <tr className="text-[11px] text-quenza-text-secondary uppercase tracking-wider font-quenza-bold border-b border-gray-100 bg-gray-50/75">
                            <th className="py-3.5 px-4">PAPER</th>
                            <th className="py-3.5 px-4">AUTHOR</th>
                            <th className="py-3.5 px-4">TIPE</th>
                            <th className="py-3.5 px-4">RUANGAN DITUGASKAN</th>
                        </tr>
                    </thead>
                    <tbody className="text-quenza-text-primary">
                        {allocations.map((item, idx) => (
                            <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'}`}>
                                <td className="py-3.5 px-4 font-quenza-semibold">{item.paper}</td>
                                <td className="py-3.5 px-4 text-quenza-text-secondary font-quenza-regular">{item.author}</td>
                                <td className="py-3.5 px-4">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${item.type === 'Poster' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {item.type ? item.type.toUpperCase() : 'ORAL'}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 text-quenza-secondary font-quenza-bold">{item.room}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import React from 'react';

export default function FinanceTable({ financeMutations }) {
    return (
        <div className="quenza-card rounded-quenza-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Keuangan & Mutasi</h3>
                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary">Log pembayaran dan refund konferensi</p>
                </div>
                <div className="flex gap-2">
                    <button className="quenza-btn-outline text-quenza-small font-quenza-medium px-3 py-1.5 border-quenza-primary text-quenza-tertiary hover:bg-green-50">
                        Cetak Struk
                    </button>
                    <button className="quenza-btn-outline text-quenza-small font-quenza-medium px-3 py-1.5 border-quenza-primary text-quenza-tertiary hover:bg-green-50">
                        Eksport PDF
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-quenza-medium">
                    <thead>
                        <tr className="border-b border-gray-200 text-quenza-small text-quenza-text-secondary uppercase tracking-wider font-quenza-semibold bg-gray-50/75">
                            <th className="py-3.5 px-4">ID</th>
                            <th className="py-3.5 px-4">Nama</th>
                            <th className="py-3.5 px-4">Nominal</th>
                            <th className="py-3.5 px-4">Keterangan</th>
                            <th className="py-3.5 px-4">Tanggal</th>
                            <th className="py-3.5 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-quenza-text-primary">
                        {financeMutations.map((item, idx) => {
                            return (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3.5 px-4 font-quenza-semibold">{item.id}</td>
                                    <td className="py-3.5 px-4">{item.name}</td>
                                    <td className="py-3.5 px-4 font-quenza-semibold">{item.amount}</td>
                                    <td className="py-3.5 px-4 text-quenza-text-secondary font-quenza-regular">{item.desc}</td>
                                    <td className="py-3.5 px-4 text-quenza-small text-quenza-text-secondary">{item.date}</td>
                                    <td className="py-3.5 px-4">
                                        {item.status === 'Paid' ? (
                                            <span className="quenza-badge-success">Paid / Lunas</span>
                                        ) : item.status === 'Process' ? (
                                            <span className="quenza-badge-warning">Process</span>
                                        ) : (
                                            <span className="quenza-badge-danger">Cancelled</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

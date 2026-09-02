import React, { useState } from 'react';

export default function ReportsTab({ metrics, filters, setFilters, onExport }) {
    const [exportFormat, setExportFormat] = useState('pdf');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="quenza-card rounded-quenza-xl p-6">
                <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">
                    Filter Laporan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            value={filters.startDate || ''}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Tanggal Akhir
                        </label>
                        <input
                            type="date"
                            value={filters.endDate || ''}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Format Export
                        </label>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                        >
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => onExport(exportFormat)}
                        className="quenza-btn-primary px-6 py-2 text-quenza-medium font-quenza-medium"
                    >
                        Ekspor Laporan
                    </button>
                </div>
            </div>

            {/* P&L Statement */}
            <div className="quenza-card rounded-quenza-xl p-6">
                <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-6">
                    Laporan Laba Rugi
                </h3>

                <div className="space-y-4">
                    {/* Income Section */}
                    <div className="border-b-2 border-gray-200 pb-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-quenza-medium font-quenza-semibold text-quenza-text-primary">
                                Pendapatan (Income)
                            </span>
                            <span className="text-quenza-medium font-quenza-bold text-emerald-600">
                                {formatCurrency(metrics?.gross_income || 0)}
                            </span>
                        </div>
                        <div className="text-quenza-small text-quenza-text-secondary space-y-1 ml-4">
                            <div className="flex justify-between">
                                <span>Registrasi Peserta</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sponsorship</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Hibah / Grant</span>
                                <span>-</span>
                            </div>
                        </div>
                    </div>

                    {/* Expense Section */}
                    <div className="border-b-2 border-gray-200 pb-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-quenza-medium font-quenza-semibold text-quenza-text-primary">
                                Pengeluaran (Expense)
                            </span>
                            <span className="text-quenza-medium font-quenza-bold text-red-600">
                                ({formatCurrency(metrics?.total_expense || 0)})
                            </span>
                        </div>
                        <div className="text-quenza-small text-quenza-text-secondary space-y-1 ml-4">
                            <div className="flex justify-between">
                                <span>Venue & Tempat</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Hotel & Akomodasi</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Honor / Gaji</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Katering & Konsumsi</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Biaya Lainnya</span>
                                <span>-</span>
                            </div>
                        </div>
                    </div>

                    {/* Net Profit */}
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-quenza-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-quenza-large font-quenza-bold text-emerald-900">
                                Saldo Bersih (Net Balance)
                            </span>
                            <span className="text-quenza-2xlarge font-quenza-bold text-emerald-600">
                                {formatCurrency(metrics?.net_balance || 0)}
                            </span>
                        </div>
                        <p className="text-quenza-small text-emerald-800 mt-2 font-quenza-medium">
                            Arus kas {(metrics?.net_balance || 0) > 0 ? 'positif' : 'negatif'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="quenza-card rounded-quenza-xl p-4">
                    <p className="text-quenza-small text-quenza-text-secondary mb-2">Total Income</p>
                    <p className="text-quenza-xlarge font-quenza-bold text-emerald-600">
                        {formatCurrency(metrics?.gross_income || 0)}
                    </p>
                </div>
                <div className="quenza-card rounded-quenza-xl p-4">
                    <p className="text-quenza-small text-quenza-text-secondary mb-2">Total Expense</p>
                    <p className="text-quenza-xlarge font-quenza-bold text-red-600">
                        {formatCurrency(metrics?.total_expense || 0)}
                    </p>
                </div>
                <div className="quenza-card rounded-quenza-xl p-4">
                    <p className="text-quenza-small text-quenza-text-secondary mb-2">Net Balance</p>
                    <p className={`text-quenza-xlarge font-quenza-bold ${
                        (metrics?.net_balance || 0) > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                        {formatCurrency(metrics?.net_balance || 0)}
                    </p>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-quenza-lg">
                <p className="text-quenza-small text-blue-900 font-quenza-medium">
                    📌 Catatan: Laporan ini menampilkan data transaksi yang sudah dikonfirmasi dan disetujui.
                    Update data secara real-time setiap kali ada perubahan status pembayaran atau pengeluaran.
                </p>
            </div>
        </div>
    );
}

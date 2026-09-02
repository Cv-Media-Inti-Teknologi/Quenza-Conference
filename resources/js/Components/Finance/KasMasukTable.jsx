import React, { useState, useEffect } from 'react';
import TransactionFormModal from './TransactionFormModal';

export default function KasMasukTable({ filters, setFilters, onSuccess }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [pagination, setPagination] = useState({ current_page: 1, total: 0 });

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                ...filters,
                status: 'paid',
            });
            const response = await fetch(`/admin/api/finance/transactions?${params}`);
            const data = await response.json();
            setTransactions(data.data || []);
            setPagination({ current_page: data.current_page, total: data.total });
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const getCategoryLabel = (type) => {
        const labels = {
            registration: 'Registrasi',
            sponsorship: 'Sponsorship',
            grant: 'Hibah',
            other: 'Lainnya',
        };
        return labels[type] || type;
    };

    const handleTransactionAdded = () => {
        setShowFormModal(false);
        fetchTransactions();
        onSuccess?.();
    };

    const handleDeleteTransaction = async (transactionId) => {
        try {
            const response = await fetch(`/admin/api/finance/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus transaksi');
            }

            fetchTransactions();
            onSuccess?.();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Gagal menghapus transaksi');
        }
    };

    return (
        <>
            <div className="quenza-card rounded-quenza-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">
                            Kas Masuk
                        </h3>
                        <p className="text-quenza-small text-quenza-text-secondary mb-4">
                            Pendapatan dari registrasi, sponsorship, dan hibah
                        </p>
                    </div>

                    {/* Filter di samping dalam 1 baris */}
                    <div className="flex flex-col sm:flex-row gap-3 items-end mb-4">
                        <div className="flex-1">
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-1.5">
                                Semua kategori
                            </label>
                            <select
                                value={filters.type || ''}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="w-full quenza-input px-3 py-2 text-quenza-small"
                            >
                                <option value="">Semua kategori</option>
                                <option value="registration">Registrasi</option>
                                <option value="sponsorship">Sponsorship</option>
                                <option value="grant">Hibah</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-1.5">
                                1 Bulan Terakhir
                            </label>
                            <select
                                value={filters.startDate || ''}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                className="w-full quenza-input px-3 py-2 text-quenza-small"
                            >
                                <option value="">1 Bulan Terakhir</option>
                                <option value="">2 Bulan Terakhir</option>
                                <option value="">6 Bulan Terakhir</option>
                                <option value="">1 Tahun Terakhir</option>
                            </select>
                        </div>
                    </div>

                    {/* Tombol dibawah */}
                    <button
                        onClick={() => setShowFormModal(true)}
                        className="quenza-btn-primary px-4 py-2 text-quenza-small font-quenza-medium"
                    >
                        + Tambah Pemasukan
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-quenza-medium">
                        <thead>
                            <tr className="border-b border-gray-200 text-quenza-small text-quenza-text-secondary uppercase tracking-wider font-quenza-semibold bg-gray-50/75">
                                <th className="py-3.5 px-4">Tanggal</th>
                                <th className="py-3.5 px-4">Deskripsi</th>
                                <th className="py-3.5 px-4">Kategori</th>
                                <th className="py-3.5 px-4">Nominal</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-quenza-text-primary">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-quenza-text-secondary">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-quenza-text-secondary">
                                        Tidak ada data transaksi
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-4 text-quenza-small">{formatDate(transaction.paid_at)}</td>
                                        <td className="py-3.5 px-4">{transaction.description || '-'}</td>
                                        <td className="py-3.5 px-4">
                                            <span className="quenza-badge-success">
                                                {getCategoryLabel(transaction.type)}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-quenza-semibold">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="quenza-badge-success">Lunas</span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Hapus data transaksi ini?')) {
                                                        handleDeleteTransaction(transaction.id);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-800 font-quenza-medium text-quenza-small transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showFormModal && (
                <TransactionFormModal
                    isOpen={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    onSuccess={handleTransactionAdded}
                />
            )}
        </>
    );
}

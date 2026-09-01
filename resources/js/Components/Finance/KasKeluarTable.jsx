import React, { useState, useEffect } from 'react';
import ExpenseFormModal from './ExpenseFormModal';

export default function KasKeluarTable({ filters, setFilters, onSuccess }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [pagination, setPagination] = useState({ current_page: 1, total: 0 });

    useEffect(() => {
        fetchExpenses();
    }, [filters]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/admin/api/finance/expenses?${params}`);
            const data = await response.json();
            setExpenses(data.data || []);
            setPagination({ current_page: data.current_page, total: data.total });
        } catch (error) {
            console.error('Error fetching expenses:', error);
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

    const getCategoryBadge = (category) => {
        const badges = {
            venue: 'bg-blue-100 text-blue-800',
            hotel: 'bg-purple-100 text-purple-800',
            honor: 'bg-pink-100 text-pink-800',
            catering: 'bg-orange-100 text-orange-800',
            online: 'bg-green-100 text-green-800',
            ticket: 'bg-red-100 text-red-800',
            sponsor: 'bg-yellow-100 text-yellow-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return badges[category] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadge = (status) => {
        if (status === 'approved') return 'quenza-badge-success';
        if (status === 'rejected') return 'quenza-badge-danger';
        return 'quenza-badge-warning';
    };

    const handleExpenseAdded = () => {
        setShowFormModal(false);
        fetchExpenses();
        onSuccess?.();
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            const response = await fetch(`/admin/api/finance/expenses/${expenseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus pengeluaran');
            }

            fetchExpenses();
            onSuccess?.();
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Gagal menghapus pengeluaran');
        }
    };

    return (
        <>
            <div className="quenza-card rounded-quenza-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-2">
                        Kas Keluar
                    </h3>
                    <p className="text-quenza-small text-quenza-text-secondary mb-4">
                        Hotel, Venue, Honor, Catering, dan biaya operasional lainnya
                    </p>
                </div>
                
                {/* Filter di samping dalam 1 baris */}
                <div className="flex flex-col sm:flex-row gap-3 items-end mb-4">
                    <div className="flex-1">
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-1.5">
                            Semua kategori
                        </label>
                        <select
                            value={filters.category || ''}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full quenza-input px-3 py-2 text-quenza-small"
                        >
                            <option value="">Semua kategori</option>
                            <option value="venue">Venue</option>
                            <option value="hotel">Hotel</option>
                            <option value="honor">Honor</option>
                            <option value="catering">Catering</option>
                            <option value="online">Online</option>
                            <option value="ticket">Tiket</option>
                            <option value="sponsor">Sponsor</option>
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
                    + Tambah Expense
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
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-quenza-text-secondary">
                                        Tidak ada data pengeluaran
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-4 text-quenza-small">{formatDate(expense.created_at)}</td>
                                        <td className="py-3.5 px-4">{expense.description}</td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-3 py-1 rounded-full text-quenza-small font-quenza-medium ${getCategoryBadge(expense.category)}`}>
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-quenza-semibold">
                                            {formatCurrency(expense.amount)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={getStatusBadge(expense.status)}>
                                                {expense.status === 'pending' ? 'Pending' : expense.status === 'approved' ? 'Lunas' : 'Ditolak'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Hapus data pengeluaran ini?')) {
                                                        handleDeleteExpense(expense.id);
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
                <ExpenseFormModal
                    isOpen={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    onSuccess={handleExpenseAdded}
                />
            )}
        </>
    );
}

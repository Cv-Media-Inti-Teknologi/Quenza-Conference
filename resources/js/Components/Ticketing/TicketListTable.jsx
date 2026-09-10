import React, { useState, useEffect } from 'react';
import TicketDetailModal from './TicketDetailModal';
import { formatCurrency } from '../../Utils/pricing';

const STATUS_TABS = [
    { id: 'paid', label: 'Terjual (Lunas)' },
    { id: 'pending', label: 'Menunggu Konfirmasi' },
    { id: 'all', label: 'Semua Status' },
];

const statusBadge = (status) => {
    switch (status) {
        case 'paid': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'expired': return 'bg-red-100 text-red-800';
        case 'refunded': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default function TicketListTable() {
    const [tickets, setTickets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('paid');
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [confirmingId, setConfirmingId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/api/ticketing/tickets?status=${statusFilter}`);
            const data = await response.json();
            // Filter out refunded tickets from the sales list
            const activeTickets = (data.data || []).filter(t => t.status !== 'refunded');
            setTickets(activeTickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDetailClick = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailModal(true);
    };

    const handleMarkAsPaid = async (ticket) => {
        if (confirmingId) return;
        setConfirmingId(ticket.id);
        try {
            const response = await fetch('/admin/api/payment/mark-as-paid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ transaction_id: ticket.id }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                showToast(data.message || 'Transaksi ditandai lunas.');
                fetchTickets();
            } else {
                showToast(data.message || 'Gagal menandai transaksi.', 'error');
            }
        } catch (error) {
            console.error('Error marking as paid:', error);
            showToast('Terjadi kesalahan jaringan.', 'error');
        } finally {
            setConfirmingId(null);
        }
    };

    const generateUniqueCode = (id) => {
        return 'QZ-' + String(id).padStart(4, '0');
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 px-5 py-4 rounded-quenza-xl shadow-md z-50 text-quenza-medium font-quenza-semibold ${
                    toast.type === 'error'
                        ? 'bg-red-50 border border-red-300 text-red-900'
                        : 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                }`}>
                    {toast.message}
                </div>
            )}

            <div className="quenza-card rounded-quenza-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                            Daftar Tiket Penjualan
                        </h3>
                        <p className="text-quenza-small text-quenza-text-secondary mt-1">
                            Transaksi tiket — verifikasi pembayaran manual (transfer/tunai) di tab Menunggu Konfirmasi
                        </p>
                    </div>
                    {/* Filter status */}
                    <div className="flex gap-2 flex-wrap">
                        {STATUS_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-4 py-2 rounded-quenza-md text-quenza-small font-quenza-semibold transition-all cursor-pointer ${
                                    statusFilter === tab.id
                                        ? 'bg-quenza-secondary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-quenza-medium">
                        <thead>
                            <tr className="border-b border-gray-200 text-quenza-small text-quenza-text-secondary uppercase tracking-wider font-quenza-semibold bg-gray-50/75">
                                <th className="py-3.5 px-4">Unique Code</th>
                                <th className="py-3.5 px-4">Peserta</th>
                                <th className="py-3.5 px-4">Nominal</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Tanggal</th>
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
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-quenza-text-secondary">
                                        Tidak ada transaksi pada filter ini
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-4 font-quenza-semibold">
                                            {generateUniqueCode(ticket.id)}
                                            <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium font-mono">
                                                {ticket.reference_code}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-4 text-quenza-small">
                                            {ticket.user?.name || '-'}
                                            <p className="text-quenza-text-secondary">{ticket.description}</p>
                                        </td>
                                        <td className="py-3.5 px-4 font-quenza-semibold">
                                            {formatCurrency(ticket.amount, ticket.currency)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-3 py-1 rounded-full text-quenza-small font-quenza-semibold ${statusBadge(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-quenza-small">
                                            {formatDate(ticket.paid_at || ticket.created_at)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDetailClick(ticket)}
                                                    className="text-quenza-primary hover:text-quenza-tertiary font-quenza-medium text-quenza-small transition-colors cursor-pointer"
                                                >
                                                    Lihat Detail
                                                </button>
                                                {ticket.status === 'pending' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMarkAsPaid(ticket)}
                                                        disabled={confirmingId === ticket.id}
                                                        className="px-3 py-1.5 rounded-quenza-md bg-quenza-primary text-gray-900 text-quenza-small font-quenza-semibold hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {confirmingId === ticket.id ? 'Memproses...' : 'Tandai Lunas'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDetailModal && selectedTicket && (
                <TicketDetailModal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    ticket={selectedTicket}
                    uniqueCode={generateUniqueCode(selectedTicket.id)}
                />
            )}
        </>
    );
}

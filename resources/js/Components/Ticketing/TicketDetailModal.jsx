import React, { useState } from 'react';

export default function TicketDetailModal({ isOpen, onClose, ticket, uniqueCode }) {
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [loading, setLoading] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleRefundSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/admin/api/ticketing/tickets/${ticket.id}/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    reason: refundReason,
                    amount: ticket.amount,
                }),
            });

            if (!response.ok) {
                throw new Error('Gagal membuat refund request');
            }

            alert('Refund request berhasil dibuat');
            setRefundReason('');
            setShowRefundForm(false);
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal membuat refund request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-quenza-xl shadow-quenza-modal max-w-sm w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                        Detail Tiket
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium">
                            Unique Code:
                        </p>
                        <p className="text-quenza-large font-quenza-bold text-quenza-text-primary mt-1">
                            {uniqueCode}
                        </p>
                    </div>

                    <div>
                        <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium">
                            Nama Pembeli:
                        </p>
                        <p className="text-quenza-medium font-quenza-semibold text-quenza-text-primary mt-1">
                            {ticket.user?.name || '-'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium">
                                Waktu Transaksi:
                            </p>
                            <p className="text-quenza-medium font-quenza-semibold text-quenza-text-primary mt-1">
                                {new Date(ticket.paid_at).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })} WIB
                            </p>
                        </div>
                        <div>
                            <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium">
                                Tanggal Transaksi:
                            </p>
                            <p className="text-quenza-medium font-quenza-semibold text-quenza-text-primary mt-1">
                                {new Date(ticket.paid_at).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium">
                            Jenis Tiket:
                        </p>
                        <p className="mt-1">
                            <span className="quenza-badge-success">
                                {ticket.type === 'registration' ? 'Author' : ticket.type}
                            </span>
                        </p>
                    </div>

                    <div>
                        <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium">
                            Metode Pembayaran:
                        </p>
                        <p className="text-quenza-medium font-quenza-semibold text-quenza-text-primary mt-1">
                            {ticket.payment_method || 'Transfer Bank'}
                        </p>
                    </div>

                    <div>
                        <p className="text-quenza-small text-quenza-text-secondary font-quenza-medium">
                            Nominal:
                        </p>
                        <p className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary mt-1">
                            {formatCurrency(ticket.amount)}
                        </p>
                    </div>

                    {!showRefundForm ? (
                        <button
                            onClick={() => setShowRefundForm(true)}
                            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-quenza-md font-quenza-semibold text-quenza-medium transition-colors"
                        >
                            Refund Dana
                        </button>
                    ) : (
                        <form onSubmit={handleRefundSubmit} className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                            <div>
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                                    Alasan Refund
                                </label>
                                <textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    placeholder="Masukkan alasan refund..."
                                    rows="3"
                                    className="w-full quenza-input px-3 py-2 text-quenza-medium resize-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRefundForm(false)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-quenza-md text-quenza-small font-quenza-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !refundReason.trim()}
                                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-quenza-md text-quenza-small font-quenza-medium transition-colors"
                                >
                                    {loading ? 'Proses...' : 'Ajukan Refund'}
                                </button>
                            </div>
                        </form>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-quenza-md text-quenza-medium font-quenza-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';

export default function RefundApprovalModal({ isOpen, onClose, refund, onSuccess }) {
    const [action, setAction] = useState('processed');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(`/admin/api/finance/refunds/${refund.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    status: action,
                    notes: notes,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrors(data.errors || { general: 'Terjadi kesalahan' });
                return;
            }

            onSuccess?.();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ general: 'Gagal memproses refund' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-quenza-xl shadow-quenza-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                        Proses Pengembalian Dana
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
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-quenza-md text-quenza-small">
                            {errors.general}
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-quenza-md">
                        <p className="text-quenza-small text-blue-900 font-quenza-medium mb-2">
                            Detail Refund Request:
                        </p>
                        <div className="space-y-1.5 text-quenza-small text-blue-800">
                            <p><span className="font-quenza-semibold">Nominal:</span> {formatCurrency(refund.amount)}</p>
                            <p><span className="font-quenza-semibold">Alasan:</span> {refund.reason}</p>
                            <p><span className="font-quenza-semibold">Diminta oleh:</span> {refund.requested_by?.name}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-3">
                                Keputusan
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="action"
                                        value="processed"
                                        checked={action === 'processed'}
                                        onChange={(e) => setAction(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-quenza-medium text-quenza-text-primary">
                                        Disetujui - Sedang Diproses
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="action"
                                        value="completed"
                                        checked={action === 'completed'}
                                        onChange={(e) => setAction(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-quenza-medium text-quenza-text-primary">
                                        Selesai - Dana Sudah Dikembalikan
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="action"
                                        value="rejected"
                                        checked={action === 'rejected'}
                                        onChange={(e) => setAction(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-quenza-medium text-quenza-text-primary">
                                        Ditolak
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                                Catatan / Keterangan
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Dana telah ditransfer ke rekening pemohon"
                                rows="3"
                                className="w-full quenza-input px-3 py-2 text-quenza-medium resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-quenza-md text-quenza-medium font-quenza-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 px-4 py-2 text-quenza-medium font-quenza-medium rounded-quenza-md text-white transition-colors disabled:opacity-50 ${
                                    action === 'rejected'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                            >
                                {loading ? 'Memproses...' : 'Simpan Keputusan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

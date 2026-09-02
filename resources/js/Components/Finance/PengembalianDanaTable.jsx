import React, { useState, useEffect } from 'react';
import RefundApprovalModal from './RefundApprovalModal';

export default function PengembalianDanaTable({ filters, setFilters, onSuccess }) {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [pagination, setPagination] = useState({ current_page: 1, total: 0 });

    useEffect(() => {
        fetchRefunds();
    }, [filters]);

    const fetchRefunds = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/admin/api/finance/refunds?${params}`);
            const data = await response.json();
            setRefunds(data.data || []);
            setPagination({ current_page: data.current_page, total: data.total });
        } catch (error) {
            console.error('Error fetching refunds:', error);
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

    const getStatusBadge = (status) => {
        if (status === 'requested') return 'quenza-badge-warning';
        if (status === 'processed') return 'quenza-badge-info';
        if (status === 'completed') return 'quenza-badge-success';
        return 'quenza-badge-danger';
    };

    const getStatusLabel = (status) => {
        const labels = {
            requested: 'Diminta',
            processed: 'Diproses',
            completed: 'Selesai',
            rejected: 'Ditolak',
        };
        return labels[status] || status;
    };

    const handleApproveClick = (refund) => {
        setSelectedRefund(refund);
        setShowApprovalModal(true);
    };

    const handleApprovalSuccess = () => {
        setShowApprovalModal(false);
        setSelectedRefund(null);
        fetchRefunds();
        onSuccess?.();
    };

    return (
        <>
            <div className="quenza-card rounded-quenza-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                                Pengembalian Dana
                            </h3>
                            <p className="text-quenza-small text-quenza-text-secondary">
                                Kelola permintaan refund dari peserta
                            </p>
                        </div>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="quenza-input px-3 py-2 text-quenza-small w-full sm:w-auto"
                        >
                            <option value="">Semua Status</option>
                            <option value="requested">Diminta</option>
                            <option value="processed">Diproses</option>
                            <option value="completed">Selesai</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-quenza-medium">
                        <thead>
                            <tr className="border-b border-gray-200 text-quenza-small text-quenza-text-secondary uppercase tracking-wider font-quenza-semibold bg-gray-50/75">
                                <th className="py-3.5 px-4">Tanggal Diminta</th>
                                <th className="py-3.5 px-4">Alasan</th>
                                <th className="py-3.5 px-4">Nominal</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-quenza-text-primary">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-quenza-text-secondary">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : refunds.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-quenza-text-secondary">
                                        Tidak ada permintaan refund
                                    </td>
                                </tr>
                            ) : (
                                refunds.map((refund, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-4 text-quenza-small">
                                            {formatDate(refund.requested_at)}
                                        </td>
                                        <td className="py-3.5 px-4 text-quenza-small">
                                            {refund.reason}
                                        </td>
                                        <td className="py-3.5 px-4 font-quenza-semibold">
                                            {formatCurrency(refund.amount)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={getStatusBadge(refund.status)}>
                                                {getStatusLabel(refund.status)}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {refund.status === 'requested' && (
                                                <button
                                                    onClick={() => handleApproveClick(refund)}
                                                    className="text-quenza-primary hover:text-quenza-tertiary font-quenza-medium text-quenza-small transition-colors"
                                                >
                                                    Proses
                                                </button>
                                            )}
                                            {refund.status !== 'requested' && (
                                                <span className="text-quenza-text-secondary text-quenza-small">
                                                    {getStatusLabel(refund.status)}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showApprovalModal && selectedRefund && (
                <RefundApprovalModal
                    isOpen={showApprovalModal}
                    onClose={() => setShowApprovalModal(false)}
                    refund={selectedRefund}
                    onSuccess={handleApprovalSuccess}
                />
            )}
        </>
    );
}

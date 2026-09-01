import React, { useState, useEffect } from 'react';
import TicketDetailModal from './TicketDetailModal';

export default function TicketListTable({ initialData }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setTickets(initialData);
        } else {
            fetchTickets();
        }
    }, [initialData]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/api/ticketing/tickets');
            const data = await response.json();
            setTickets(data.data || []);
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

    const generateUniqueCode = (id) => {
        const code = 'QZ-' + String(id).padStart(4, '0');
        return code;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <>
            <div className="quenza-card rounded-quenza-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                        Daftar Tiket Penjualan
                    </h3>
                    <p className="text-quenza-small text-quenza-text-secondary mt-1">
                        Daftar tiket yang telah terjual
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-quenza-medium">
                        <thead>
                            <tr className="border-b border-gray-200 text-quenza-small text-quenza-text-secondary uppercase tracking-wider font-quenza-semibold bg-gray-50/75">
                                <th className="py-3.5 px-4">Unique Code</th>
                                <th className="py-3.5 px-4">Tanggal Transaksi</th>
                                <th className="py-3.5 px-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-quenza-text-primary">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-quenza-text-secondary">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-quenza-text-secondary">
                                        Tidak ada tiket terjual
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-4 font-quenza-semibold">
                                            {generateUniqueCode(ticket.id)}
                                        </td>
                                        <td className="py-3.5 px-4 text-quenza-small">
                                            {formatDate(ticket.paid_at)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                onClick={() => handleDetailClick(ticket)}
                                                className="text-quenza-primary hover:text-quenza-tertiary font-quenza-medium text-quenza-small transition-colors"
                                            >
                                                Lihat Detail
                                            </button>
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

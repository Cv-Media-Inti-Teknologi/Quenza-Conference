import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function MyTickets({ transactions = [], loading = false, ticketPricing = []}) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const formatCurrency = (amount, currency = 'IDR') => {
        if (currency === 'USD') {
            return '$ ' + new Intl.NumberFormat('en-US').format(parseFloat(amount) || 0);
        }
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(parseFloat(amount) || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateShort = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const filters = [
        { id: 'all', label: 'Semua Status' },
        { id: 'paid', label: 'Masuk (Paid)' },
        { id: 'pending', label: 'Pending' },
        { id: 'expired', label: 'Kadaluarsa' },
        { id: 'refunded', label: 'Dikembalikan' },
    ];

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch = search === '' ||
            t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.reference_code?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getPricingInfo = (type) => {
        const pricing = ticketPricing.find((p) => p.category === type);
        return pricing ? formatCurrency(pricing.regular_price) : 'Rp 0';
    };

    return (
        <PublicLayout title="My Tickets" subtitle="Tiket dan info pembayaran Anda">
            <Head title="My Tickets" />

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-quenza-bold text-gray-900 mb-1">My Tickets</h1>
                        <p className="text-quenza-medium text-gray-600">
                            Tiket yang sudah Anda beli untuk konferensi
                        </p>
                    </div>
                    <Link
                        href="/pricing"
                        className="px-6 py-3 rounded-quenza-lg bg-quenza-primary text-white font-quenza-semibold hover:brightness-105 transition-all"
                    >
                        <svg className="w-5 h-5 inline mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Beli Tiket Baru
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-quenza-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari nama atau kode referensi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 quenza-input px-4 py-3 text-quenza-medium"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="quenza-input px-4 py-3 text-quenza-medium w-full sm:w-52"
                    >
                        {filters.map((f) => (
                            <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                    </select>
                </div>

                {/* Tickets List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 animate-spin text-quenza-primary" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p>Memuat tiket...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="bg-white rounded-quenza-xl border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 7h2m0 0v2m0-2h-2m2 2v2m0-2H9m-6 6H5m10 0a2 2 0 002-2v-8a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                        </svg>
                        <h3 className="text-xl font-quenza-semibold text-gray-900 mb-2">
                            {search || statusFilter !== 'all' ? 'Tidak ada tiket yang ditemukan' : 'Belum ada tiket yang dibeli'}
                        </h3>
                        <p className="text-quenza-medium text-gray-600 mb-4">
                            {search || statusFilter !== 'all'
                                ? 'Coba ubah filter atau kata kunci pencarian'
                                : 'Beli tiket untuk bergabung dalam konferensi'}
                        </p>
                        {!search && statusFilter === 'all' && (
                            <Link
                                href="/pricing"
                                className="inline-block px-6 py-3 rounded-quenza-lg bg-quenza-primary text-white font-quenza-semibold hover:brightness-105 transition-all"
                            >
                                Beli Tiket Baru
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTransactions.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="bg-white rounded-quenza-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-3 py-1 rounded-full text-quenza-small font-quenza-semibold bg-gray-100 text-gray-700">
                                                #{ticket.reference_code || 'QZ-' + ticket.id}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-quenza-small font-quenza-semibold ${
                                                ticket.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                ticket.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <h3 className="text-quenza-medium font-quenza-semibold text-gray-900 mt-2 mb-1">
                                            {ticket.user?.name || 'Peserta'}
                                        </h3>
                                        <p className="text-quenza-small text-gray-500">{ticket.type === 'registration' ? 'Registration' : ticket.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-quenza-bold text-gray-900">{formatCurrency(ticket.amount, ticket.currency)}</p>
                                        <p className="text-quenza-small text-gray-500">{getPricingInfo(ticket.type)}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4 text-quenza-small">
                                    <div>
                                        <span className="text-gray-500 block">Tanggal</span>
                                        <span className="font-quenza-medium text-gray-900">{formatDateShort(ticket.paid_at)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Waktu</span>
                                        <span className="font-quenza-medium text-gray-900">{formatDate(ticket.paid_at)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Metode</span>
                                        <span className="font-quenza-medium text-gray-900">{ticket.payment_method || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Kode Ref</span>
                                        <span className="font-quenza-medium text-gray-900">{ticket.reference_code || '-'}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                                    <Link
                                        href={`/payment/${ticket.id}/waiting`}
                                        className={`flex-1 min-w-[140px] px-4 py-2 rounded-quenza-md text-center text-quenza-medium font-quenza-medium transition-all ${
                                            ticket.status === 'pending'
                                                ? 'bg-quenza-secondary text-white hover:brightness-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {ticket.status === 'pending' ? 'Selesaikan Pembayaran' : 'Lihat Detail'}
                                    </Link>
                                    {ticket.status === 'paid' && (
                                        <>
                                            <Link
                                                href={`/user/tickets/${ticket.id}/receipt`}
                                                className="px-4 py-2 rounded-quenza-md bg-quenza-primary text-gray-900 text-quenza-medium font-quenza-semibold hover:brightness-105 transition-all"
                                            >
                                                Unduh Tiket
                                                <svg className="w-4 h-4 inline ml-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href="/author/papers/submit"
                                                className="px-4 py-2 rounded-quenza-md border border-gray-300 text-gray-700 text-quenza-medium font-quenza-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Submit Paper
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

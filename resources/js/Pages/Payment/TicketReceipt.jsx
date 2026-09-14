import React from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { formatCurrency } from '../../Utils/pricing';

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export default function TicketReceipt({ transaction, conference }) {
    const isPaid = transaction.status === 'paid';

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        router.visit('/user/tickets');
    };

    return (
        <PublicLayout title="E-Ticket" subtitle="Tiket elektronik konferensi Anda">
            <Head title="E-Ticket | Quenza Conference" />

            {/* Style khusus cetak: sembunyikan header/footer layout & tombol saat print */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #receipt-print-area, #receipt-print-area * { visibility: visible; }
                    #receipt-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>

            <div className="max-w-2xl mx-auto px-4 py-10">
                <div id="receipt-print-area" className="bg-white rounded-quenza-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header tiket */}
                    <div className="bg-quenza-sidebar text-white px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-quenza-md bg-quenza-primary flex items-center justify-center text-gray-900 font-quenza-bold">Q</div>
                                <div>
                                    <p className="font-quenza-bold text-quenza-large">{conference?.title || 'Quenza Conference System'}</p>
                                    <p className="text-green-100 text-quenza-small">{conference?.date_range || ''}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-quenza-small font-quenza-bold ${
                                isPaid ? 'bg-green-400 text-green-900' : 'bg-yellow-300 text-yellow-900'
                            }`}>
                                {isPaid ? 'LUNAS' : transaction.status?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* QR code — render real-time di browser via QR Server API (data: kode referensi) */}
                    <div className="flex justify-center py-6 border-b border-dashed border-gray-300 print:bg-white">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(String(transaction.reference_code || ('QZ-' + transaction.id)))}`}
                            alt={'QR ' + (transaction.reference_code || transaction.id)}
                            className="w-[180px] h-[180px]"
                        />
                    </div>

                    {/* Detail transaksi */}
                    <div className="px-8 py-6 space-y-4">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-quenza-bold text-gray-900">E-Ticket Peserta</h1>
                            <p className="text-quenza-small text-gray-500 mt-1">Tunjukkan tiket ini saat registrasi ulang di lokasi</p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-quenza-medium">
                            <div>
                                <span className="text-gray-500 block text-quenza-small">Nama Peserta</span>
                                <span className="font-quenza-semibold text-gray-900">{transaction.user?.name || '-'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-quenza-small">Email</span>
                                <span className="font-quenza-semibold text-gray-900 break-all">{transaction.user?.email || '-'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-quenza-small">Kode Referensi</span>
                                <span className="font-quenza-semibold text-gray-900 font-mono">{transaction.reference_code || ('QZ-' + transaction.id)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-quenza-small">Jenis Tiket</span>
                                <span className="font-quenza-semibold text-gray-900 capitalize">{transaction.type || '-'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-quenza-small">Metode Pembayaran</span>
                                <span className="font-quenza-semibold text-gray-900 capitalize">{(transaction.payment_method || '-').replace(/_/g, ' ')}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-quenza-small">Tanggal Bayar</span>
                                <span className="font-quenza-semibold text-gray-900">{formatDate(transaction.paid_at)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                            <span className="text-gray-500 text-quenza-small">Total Dibayar</span>
                            <span className="text-2xl font-quenza-bold text-gray-900">
                                {formatCurrency(transaction.amount, transaction.currency)}
                            </span>
                        </div>

                        {conference?.location && (
                            <p className="text-quenza-small text-gray-500 text-center pt-2 border-t border-gray-100">
                                {conference.location}
                            </p>
                        )}
                    </div>
                </div>

                {/* Aksi — disembunyikan saat print */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 px-6 py-3 rounded-quenza-lg bg-quenza-secondary text-white font-quenza-semibold hover:brightness-105 transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5 inline mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Unduh / Cetak Tiket (PDF)
                    </button>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 rounded-quenza-lg border border-gray-300 text-gray-700 font-quenza-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Kembali ke Tiket Saya
                    </button>
                </div>
            </div>
        </PublicLayout>
    );
}

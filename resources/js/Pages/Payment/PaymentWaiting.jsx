import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const METHOD_LABELS = {
    virtual_account: {
        label: 'Virtual Account',
        steps: [
            'Buka aplikasi mobile banking / ATM Anda.',
            'Pilih menu Transfer → Virtual Account.',
            'Masukkan nomor virtual account di bawah ini.',
            'Pastikan nominal sesuai, lalu konfirmasi pembayaran.',
        ],
        infoLabel: 'Nomor Virtual Account (simulasi)',
        infoValueKey: 'vaNumber',
    },
    transfer: {
        label: 'Transfer Bank',
        steps: [
            'Transfer tepat sesuai nominal ke rekening berikut.',
            'Gunakan kode referensi sebagai berita transfer.',
            'Simpan bukti transfer untuk konfirmasi.',
        ],
        infoLabel: 'Nomor Rekening (simulasi)',
        infoValueKey: 'accountNumber',
    },
    qris: {
        label: 'QRIS',
        steps: [
            'Buka aplikasi e-wallet atau mobile banking Anda.',
            'Pilih menu Scan QR / QRIS.',
            'Scan kode QR di bawah ini dan selesaikan pembayaran.',
        ],
        infoLabel: 'Kode QRIS (simulasi)',
        infoValueKey: 'qrisCode',
    },
    cash: {
        label: 'Tunai (Di Tempat)',
        steps: [
            'Simpan kode referensi Anda.',
            'Datang ke lokasi pendaftaran konferensi.',
            'Tunjukkan kode referensi dan lakukan pembayaran tunai.',
        ],
        infoLabel: 'Kode Referensi',
        infoValueKey: 'referenceCode',
    },
};

const STATUS_STYLES = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-gray-100 text-gray-700',
    expired: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function PaymentWaiting({ transaction }) {
    const { flash } = usePage().props;

    const formatCurrency = (amount, currency = 'IDR') => {
        if (currency === 'USD') {
            return '$ ' + new Intl.NumberFormat('en-US').format(parseFloat(amount) || 0);
        }
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(parseFloat(amount) || 0);
    };

    if (!transaction) {
        return (
            <PublicLayout title="Pembayaran" subtitle="Transaksi tidak ditemukan">
                <Head title="Pembayaran | Quenza Conference" />
                <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                    <p className="text-quenza-medium text-gray-600">Transaksi tidak ditemukan.</p>
                    <Link href="/user/tickets" className="mt-4 inline-block quenza-btn-primary px-6 py-3 rounded-quenza-lg">
                        Kembali ke Tiket Saya
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    const method = METHOD_LABELS[transaction.payment_method] || METHOD_LABELS.transfer;
    const isPending = transaction.status === 'pending';
    const isPaid = transaction.status === 'paid';

    // Nilai simulasi deterministik untuk development (bukan data gateway asli)
    const simulatedValues = {
        vaNumber: `8808${String(transaction.id).padStart(8, '0')}`,
        accountNumber: `BCA 1234567890 a/n QUENZA CONFERENCE (${transaction.reference_code})`,
        qrisCode: `QR-${transaction.reference_code}`,
        referenceCode: transaction.reference_code,
    };

    return (
        <PublicLayout title="Instruksi Pembayaran" subtitle="Selesaikan pembayaran tiket Anda">
            <Head title="Instruksi Pembayaran | Quenza Conference" />

            <div className="max-w-3xl mx-auto px-4 py-10">
                <Link href="/user/tickets" className="text-quenza-medium text-gray-600 hover:text-quenza-primary mb-4 inline-block">
                    ← Kembali ke Tiket Saya
                </Link>

                {flash?.success && (
                    <div className="mb-6 p-4 rounded-quenza-md bg-emerald-50 border border-emerald-300 text-emerald-800">
                        <p className="text-quenza-medium">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 p-4 rounded-quenza-md bg-red-50 border border-red-300 text-red-800">
                        <p className="text-quenza-medium">{flash.error}</p>
                    </div>
                )}

                {/* Ringkasan Transaksi */}
                <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-wider">
                                {transaction.type === 'registration' ? 'Registrasi Konferensi' : transaction.type}
                            </span>
                            <h1 className="text-quenza-2xlarge font-quenza-bold text-gray-900 mt-1">
                                {formatCurrency(transaction.amount, transaction.currency)}
                            </h1>
                            <p className="text-quenza-small text-gray-500 mt-1">{transaction.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-quenza-small font-quenza-semibold ${STATUS_STYLES[transaction.status] || 'bg-gray-100 text-gray-700'}`}>
                            {isPaid ? 'Lunas' : isPending ? 'Menunggu Pembayaran' : transaction.status}
                        </span>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-quenza-medium border-t border-gray-100 pt-4">
                        <div>
                            <dt className="text-quenza-small text-gray-500">Kode Referensi</dt>
                            <dd className="font-quenza-semibold text-gray-900 font-mono">{transaction.reference_code}</dd>
                        </div>
                        <div>
                            <dt className="text-quenza-small text-gray-500">Metode Pembayaran</dt>
                            <dd className="font-quenza-semibold text-gray-900">{method.label}</dd>
                        </div>
                        <div>
                            <dt className="text-quenza-small text-gray-500">Atas Nama</dt>
                            <dd className="font-quenza-semibold text-gray-900">{transaction.user_name || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-quenza-small text-gray-500">Berlaku Hingga</dt>
                            <dd className="font-quenza-semibold text-gray-900">{transaction.expires_at || '-'}</dd>
                        </div>
                    </dl>
                </div>

                {/* Instruksi Pembayaran */}
                {isPending && (
                    <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 mb-6">
                        <h2 className="text-quenza-large font-quenza-bold text-gray-900 mb-4">
                            Cara Pembayaran — {method.label}
                        </h2>

                        <div className="bg-gray-50 border border-gray-200 rounded-quenza-lg p-4 mb-4">
                            <p className="text-quenza-small text-gray-500 mb-1">{method.infoLabel}</p>
                            <p className="text-quenza-large font-quenza-bold text-gray-900 font-mono break-all">
                                {simulatedValues[method.infoValueKey]}
                            </p>
                        </div>

                        <ol className="space-y-3 text-quenza-medium text-gray-700">
                            {method.steps.map((step, idx) => (
                                <li key={idx} className="flex gap-3">
                                    <span className="w-6 h-6 rounded-full bg-quenza-secondary text-white flex items-center justify-center text-quenza-small font-quenza-bold shrink-0">
                                        {idx + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>

                        <p className="mt-4 text-quenza-small text-gray-500 bg-blue-50 border border-blue-200 rounded-quenza-md p-3">
                            ℹ️ Ini adalah pembayaran simulasi untuk pengembangan. Pada production, instruksi & status
                            pembayaran otomatis diperbarui oleh payment gateway (Midtrans/Xendit).
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.post(`/payment/${transaction.id}/confirm`, {}, {
                                    preserveScroll: true,
                                })
                            }
                            className="mt-6 w-full sm:w-auto px-8 py-3 rounded-quenza-lg bg-quenza-secondary text-white font-quenza-semibold hover:brightness-105 transition-all"
                        >
                            Saya Sudah Bayar — Konfirmasi
                        </button>
                    </div>
                )}

                {/* Status Lunas */}
                {isPaid && (
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-quenza-xl p-6 sm:p-8 text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-quenza-xlarge font-quenza-bold text-emerald-900 mb-2">
                            Pembayaran Lunas!
                        </h2>
                        <p className="text-quenza-medium text-emerald-800 mb-1">
                            Dikonfirmasi pada {transaction.paid_at || '-'}.
                        </p>
                        <p className="text-quenza-small text-emerald-700 mb-6">
                            {transaction.type === 'registration'
                                ? 'Akun Anda sudah terverifikasi. Anda bisa submit paper atau mengikuti konferensi.'
                                : 'Terima kasih telah berpartisipasi dalam konferensi.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/author/papers/submit"
                                className="px-6 py-3 rounded-quenza-lg bg-quenza-primary text-gray-900 font-quenza-semibold hover:brightness-105 transition-all"
                            >
                                Submit Paper Anda
                            </Link>
                            <Link
                                href={`/user/tickets/${transaction.id}/receipt`}
                                className="px-6 py-3 rounded-quenza-lg border border-emerald-300 text-emerald-800 font-quenza-semibold hover:bg-emerald-100 transition-all"
                            >
                                Unduh Tiket
                            </Link>
                            <Link
                                href="/user/tickets"
                                className="px-6 py-3 rounded-quenza-lg border border-emerald-300 text-emerald-800 font-quenza-semibold hover:bg-emerald-100 transition-all"
                            >
                                Lihat Tiket Saya
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

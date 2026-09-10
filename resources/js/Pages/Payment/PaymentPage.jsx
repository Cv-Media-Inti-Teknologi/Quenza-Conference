import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const PAYMENT_METHODS = [
    { value: 'virtual_account', label: 'Virtual Account' },
    { value: 'transfer', label: 'Transfer Bank' },
    { value: 'qris', label: 'QRIS' },
    { value: 'cash', label: 'Tunai (Tempat)' },
];

export default function PaymentPage({ auth, ticketPricing = [] }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('virtual_account');
    const [processing, setProcessing] = useState(false);
    const [notice, setNotice] = useState(null);

    const pricingMap = {};
    ticketPricing.forEach(p => {
        pricingMap[p.category] = {
            regular_price: p.regular_price || 0,
            late_price: p.late_price || 0,
            currency: p.currency || 'IDR',
        };
    });

    const plans = [
        {
            key: 'participant-offline',
            title: 'Participant Offline',
            subtitle: 'Tiket Hadir Langsung',
            description: 'Untuk peserta yang menghadiri konferensi secara langsung di lokasi.',
            price: pricingMap['participant']?.regular_price || 1500000,
            currency: pricingMap['participant']?.currency || 'IDR',
            features: [
                'Akses penuh selama konferensi',
                'Akses ke seluruh sesi dan workshop',
                'Sertifikat peserta',
            ],
            isRecommended: false,
        },
        {
            key: 'student-offline',
            title: 'Participant Mahasiswa Offline',
            subtitle: 'Tiket Hadir Langsung',
            description: 'Diskon khusus untuk mahasiswa aktif yang menghadiri konferensi secara langsung.',
            price: pricingMap['student']?.regular_price || 500000,
            currency: pricingMap['student']?.currency || 'IDR',
            features: [
                'Akses penuh selama konferensi',
                'Akses ke seluruh sesi dan workshop',
                'Sertifikat peserta',
            ],
            isRecommended: false,
        },
        {
            key: 'author',
            title: 'Presenter Mahasiswa',
            subtitle: 'Daftar Sebagai Author',
            description: 'Untuk penulis mahasiswa yang akan mempresentasikan makalah di konferensi.',
            price: pricingMap['author']?.regular_price || 1500000,
            currency: pricingMap['author']?.currency || 'IDR',
            features: [
                'Akses penuh selama konferensi',
                'Kesempatan mempresentasikan makalah',
                'Publikasi dalam prosiding',
                'Sertifikat sebagai pemakalah',
            ],
            isRecommended: true,
        },
        {
            key: 'presiden',
            title: 'Presenter Dosen/Alumni',
            subtitle: 'Daftar Sebagai Author',
            description: 'Paket khusus untuk dosen dan alumni yang mempresentasikan makalah.',
            price: pricingMap['presiden']?.regular_price || 5000000,
            currency: pricingMap['presiden']?.currency || 'IDR',
            features: [
                'Akses penuh selama konferensi',
                'Kesempatan mempresentasikan makalah',
                'Publikasi dalam prosiding',
                'Sertifikat sebagai pemakalah',
                'Akses ke seluruh sesi dan workshop',
                'Prioritas penempatan session',
            ],
            isRecommended: true,
        },
        {
            key: 'participant-online',
            title: 'Participant Online',
            subtitle: 'Tiket Virtual/Hybrid',
            description: 'Untuk peserta yang mengikuti konferensi secara daring.',
            price: pricingMap['participant_online']?.regular_price || 750000,
            currency: pricingMap['participant_online']?.currency || 'IDR',
            features: [
                'Akses penuh konferensi secara daring',
                'Akses ke seluruh sesi dan workshop',
                'Sertifikat peserta',
            ],
            isRecommended: false,
        },
        {
            key: 'student-online',
            title: 'Participant Mahasiswa Online',
            subtitle: 'Tiket Virtual/Hybrid',
            description: 'Diskon khusus mahasiswa untuk partisipasi daring.',
            price: pricingMap['student_online']?.regular_price || 300000,
            currency: pricingMap['student_online']?.currency || 'IDR',
            features: [
                'Akses penuh konferensi secara daring',
                'Akses ke seluruh sesi dan workshop',
                'Sertifikat peserta',
            ],
            isRecommended: false,
        },
        {
            key: 'international-participant',
            title: 'International Participant',
            subtitle: 'Tiket Hadir Langsung',
            description: 'For international participants attending the conference on-site.',
            price: pricingMap['international_participant']?.regular_price || 20,
            currency: pricingMap['international_participant']?.currency || 'USD',
            features: [
                'Full conference access',
                'Access to all sessions and workshops',
                'Participant certificate',
            ],
            isRecommended: false,
        },
        {
            key: 'international-author',
            title: 'International Presenter',
            subtitle: 'Register as Author',
            description: 'For international authors presenting their papers.',
            price: pricingMap['international_author']?.regular_price || 40,
            currency: pricingMap['international_author']?.currency || 'USD',
            features: [
                'Full conference access',
                'Opportunity to present your paper',
                'Publication in proceedings',
                'Presenter certificate',
            ],
            isRecommended: false,
        },
        {
            key: 'international-participant-online',
            title: 'International Participant Online',
            subtitle: 'Virtual Access',
            description: 'For international participants joining the conference virtually.',
            price: pricingMap['international_participant_online']?.regular_price || 10,
            currency: pricingMap['international_participant_online']?.currency || 'USD',
            features: [
                'Full virtual conference access',
                'Access to all sessions and workshops',
                'Participant certificate',
            ],
            isRecommended: false,
        },
    ];

    const formatCurrency = (amount, currency = 'IDR') => {
        if (currency === 'USD') return '$ ' + new Intl.NumberFormat('en-US').format(parseFloat(amount) || 0);
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(parseFloat(amount) || 0);
    };

    const handleBuy = (plan) => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }
        setSelectedPlan(plan);
        setNotice(null);
    };

    const submitPayment = async () => {
        if (!selectedPlan) return;
        setProcessing(true);
        try {
            router.post('/api/payment/initiate', {
                type: 'registration',
                category: selectedPlan.key,
                payment_method: paymentMethod,
            }, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setProcessing(false);
                    const tx = page?.props?.flash?.transaction;
                    if (tx?.id) {
                        router.visit(`/payment/${tx.id}/waiting`);
                    } else {
                        setNotice({
                            type: 'success',
                            message: 'Pembayaran berhasil diinisiasi. Cek halaman Tiket Saya untuk melanjutkan.',
                        });
                    }
                },
                onError: () => {
                    setProcessing(false);
                    setNotice({ type: 'error', message: 'Gagal memulai pembayaran.' });
                },
            });
        } catch (error) {
            setProcessing(false);
        }
    };

    return (
        <PublicLayout title="Pembayaran Tiket" subtitle="Pilih paket dan lanjutkan pembayaran">
            <Head title="Pembayaran Tiket | Quenza Conference" />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/pricing" className="text-quenza-medium text-gray-600 hover:text-quenza-primary mb-2 inline-block">
                            ← Kembali ke Harga
                        </Link>
                        <h1 className="text-2xl font-quenza-bold text-gray-900">Pembayaran Tiket</h1>
                        <p className="text-quenza-medium text-gray-600">Pilih paket tiket yang ingin Anda beli.</p>
                    </div>
                    {auth?.user && (
                        <div className="text-right">
                            <p className="text-quenza-small text-gray-500">Anda login sebagai</p>
                            <p className="font-quenza-semibold text-gray-900">{auth.user.name} ({auth.user.role})</p>
                        </div>
                    )}
                </div>

                {!selectedPlan ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.key}
                                className={`bg-white rounded-quenza-xl border ${plan.isRecommended ? 'border-2 border-quenza-secondary shadow-md' : 'border-gray-200'} p-6 transition-all cursor-pointer hover:shadow-md ${plan.isRecommended ? 'scale-[1.02]' : ''}`}
                            >
                                {plan.isRecommended && (
                                    <div className="absolute -top-3 left-6 bg-quenza-secondary text-white px-3 py-1 rounded-full text-quenza-small font-quenza-bold uppercase tracking-wider z-10">
                                        Rekomendasi
                                    </div>
                                )}
                                <div className="mt-2">
                                    <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-wider">
                                        {plan.title}
                                    </span>
                                    <h2 className="text-quenza-2xlarge font-quenza-bold text-gray-900 mt-1">
                                        {plan.subtitle}
                                    </h2>
                                    <p className="text-quenza-small text-gray-500 mt-1">{plan.description}</p>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-quenza-4xlarge font-quenza-bold text-gray-900">
                                            {formatCurrency(plan.price, plan.currency)}
                                        </span>
                                    </div>
                                    <ul className="mt-6 space-y-3 text-quenza-medium text-gray-600">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        onClick={() => handleBuy(plan)}
                                        className={`mt-6 w-full py-3 rounded-quenza-lg font-quenza-semibold transition-all ${plan.isRecommended ? 'bg-quenza-secondary text-white hover:brightness-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Pilih & Bayar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 max-w-3xl mx-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-quenza-bold text-gray-900">Konfirmasi Pembayaran</h2>
                                <p className="text-quenza-medium text-gray-600 mt-1">Review paket sebelum melanjutkan pembayaran.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedPlan(null);
                                    setNotice(null);
                                }}
                                className="text-quenza-medium text-gray-600 hover:text-gray-900"
                            >
                                Batal
                            </button>
                        </div>

                        <div className="border border-gray-200 rounded-quenza-lg p-4 mb-6 bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-quenza-semibold text-gray-900">{selectedPlan.title}</p>
                                    <p className="text-quenza-small text-gray-500 mt-1">{selectedPlan.subtitle}</p>
                                </div>
                                <p className="text-quenza-2xlarge font-quenza-bold text-gray-900">
                                    {formatCurrency(selectedPlan.price, selectedPlan.currency)}
                                </p>
                            </div>
                            <ul className="mt-4 space-y-2 text-quenza-medium text-gray-600">
                                {selectedPlan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-6">
                            <label className="block text-quenza-medium font-quenza-semibold text-gray-700 mb-2">
                                Metode Pembayaran <span className="text-red-600">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {PAYMENT_METHODS.map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        onClick={() => setPaymentMethod(m.value)}
                                        className={`px-4 py-3 rounded-quenza-md border text-left transition-all ${paymentMethod === m.value ? 'border-quenza-primary bg-quenza-sidebar text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {notice && (
                            <div className={`mb-6 p-4 rounded-quenza-md border ${notice.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
                                <p className="text-quenza-medium">{notice.message}</p>
                            </div>
                        )}

                        <div className="flex gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={submitPayment}
                                disabled={processing}
                                className="flex-1 px-6 py-3 rounded-quenza-lg bg-quenza-primary text-white font-quenza-semibold hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75 fill-current" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : 'Lanjutkan Pembayaran'}
                            </button>
                            <Link
                                href="/pricing"
                                className="px-6 py-3 rounded-quenza-lg border border-gray-300 text-quenza-medium font-quenza-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                        </div>

                        <p className="mt-4 text-quenza-small text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Pembayaran aman. Kami tidak menyimpan data kartu/piutang Anda.
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

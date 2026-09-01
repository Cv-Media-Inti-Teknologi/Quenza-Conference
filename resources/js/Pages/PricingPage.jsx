import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function PricingPage({ auth, ticketPricing = [] }) {
    // Use dynamic pricing if available
    const pricingMap = {};
    ticketPricing.forEach(p => {
        pricingMap[p.category] = {
            regular_price: p.regular_price || 0,
            late_price: p.late_price || 0,
        };
    });

    const plans = [
        {
            title: 'Participant',
            subtitle: 'Offline',
            description: 'Untuk peserta yang menghadiri konferensi secara langsung.',
            category: 'participant',
            prices: [
                { label: 'Umum', price: pricingMap['participant']?.regular_price || 1500000 },
                { label: 'Mahasiswa', price: pricingMap['student']?.regular_price || 500000 },
                { label: 'International', price: 20, isUSD: true },
            ],
            features: ['Akses penuh selama konferensi', 'Akses ke seluruh sesi dan workshop', 'Sertifikat peserta'],
            primary: false,
            buttonLabel: 'Beli Tiket Peserta',
        },
        {
            title: 'Presenter',
            subtitle: 'Pemakalah',
            description: 'Untuk peserta yang mempresentasikan makalah.',
            category: 'author',
            prices: [
                { label: 'Dosen/Alumni', price: pricingMap['president']?.regular_price || 5000000 },
                { label: 'Mahasiswa', price: pricingMap['author']?.regular_price || 1500000 },
                { label: 'International', price: 40, isUSD: true },
            ],
            features: ['Akses penuh selama konferensi', 'Kesempatan mempresentasikan makalah', 'Publikasi dalam prosiding', 'Sertifikat sebagai pemakalah', 'Akses ke seluruh sesi dan workshop'],
            primary: true,
            buttonLabel: 'Daftar Sebagai Author',
        },
        {
            title: 'Participant',
            subtitle: 'Online',
            description: 'Untuk peserta yang mengikuti konferensi secara virtual.',
            category: 'participant',
            prices: [
                { label: 'Umum', price: pricingMap['participant']?.regular_price || 1500000 },
                { label: 'Mahasiswa', price: pricingMap['student']?.regular_price || 500000 },
                { label: 'International', price: 10, isUSD: true },
            ],
            features: ['Akses penuh konferensi secara daring', 'Akses ke seluruh sesi dan workshop', 'Sertifikat peserta'],
            primary: false,
            buttonLabel: 'Beli Tiket Peserta',
        },
    ];

    const formatCurrency = (amount, isUSD = false) => {
        if (isUSD) return `$ ${amount}`;
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
    };

    const handleBuyTicket = (category) => {
        router.post('/admin/api/payment/initiate', {
            type: 'registration',
            payment_method: 'virtual_account',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Pembayaran berhasil diinisiasi! Silakan selesaikan pembayaran melalui metode yang dipilih.');
            },
            onError: () => {
                alert('Gagal memulai pembayaran');
            },
        });
    };

    return (
        <div className="min-h-screen bg-quenza-bg text-quenza-text-primary flex flex-col font-sans selection:bg-quenza-primary selection:text-white antialiased">
            <Head>
                <title>Pricing | Quenza Conference</title>
                <meta name="description" content="Paket registrasi Quenza Conference." />
            </Head>

            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-quenza-md bg-quenza-secondary flex items-center justify-center text-white shadow-xs">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary tracking-tight">Quenza</span>
                            <span className="text-quenza-small font-mono tracking-widest text-quenza-secondary block uppercase">Conference</span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-quenza-medium font-quenza-medium text-gray-600">
                        <Link href="/" className="hover:text-quenza-secondary transition-colors">Tentang</Link>
                        <Link href="/speaker" className="hover:text-quenza-secondary transition-colors">Pembicara</Link>
                        <Link href="/timeline" className="hover:text-quenza-secondary transition-colors">Linimasa</Link>
                        <Link href="/pricing" className="text-quenza-secondary font-quenza-semibold">Paket Registrasi</Link>
                        <a href="/#sponsors" className="hover:text-quenza-secondary transition-colors">Sponsor</a>
                    </nav>

                    {auth?.user ? (
                        <div className="flex items-center gap-3 relative">
                            <Link href="/portal" className="hidden sm:inline-flex quenza-btn-outline text-quenza-medium font-quenza-semibold px-5 py-2.5 rounded-quenza-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                                Pantau Hasil Paper
                            </Link>
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="px-4 py-2 rounded-quenza-md bg-quenza-secondary text-white text-quenza-medium font-quenza-semibold shadow-xs hover:brightness-105"
                            >
                                Keluar
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-5 py-2.5 rounded-quenza-md text-quenza-medium font-quenza-semibold text-gray-700 hover:bg-gray-100/80 transition-colors">
                                Masuk
                            </Link>
                            <Link href="/register" className="quenza-btn-secondary text-quenza-medium font-quenza-semibold px-5 py-2.5 rounded-quenza-md text-white shadow-xs hover:brightness-105 transition-all">
                                Daftar Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1">
                <section id="pricing" className="py-20 bg-quenza-bg border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-widest bg-green-100/70 px-3.5 py-1 rounded-full border border-green-200">
                                Investasi Partisipasi
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-quenza-bold text-gray-900 mt-3">
                                Paket Registrasi &amp; Tiket
                            </h1>
                            <p className="text-quenza-medium text-gray-600 mt-3">
                                Pilihan paket partisipasi untuk Pemakalah (Author) dan Peserta (Participant).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {plans.map((plan) => (
                                <div
                                    key={plan.title + plan.subtitle}
                                    className={`bg-white rounded-quenza-2xl border ${plan.primary ? 'border-2 border-quenza-secondary shadow-xl scale-[1.02]' : 'border-gray-200 shadow-xs'} p-8 flex flex-col justify-between hover:shadow-md transition-all relative`}
                                >
                                    {plan.primary && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-quenza-secondary text-white px-4 py-1 rounded-full text-quenza-small font-quenza-bold tracking-wider uppercase">
                                            Rekomendasi
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-quenza-small font-quenza-bold text-quenza-secondary uppercase tracking-wider">
                                            {plan.title}
                                        </span>
                                        <h3 className="text-quenza-2xlarge font-quenza-bold text-gray-900 mt-1">
                                            {plan.subtitle}
                                        </h3>
                                        <p className="text-quenza-small text-gray-500 mt-1">
                                            {plan.description}
                                        </p>
                                        {plan.prices.map((price, idx) => (
                                            <div key={idx} className="my-4">
                                                <span className={`font-quenza-bold text-gray-900 ${idx === 0 ? 'text-quenza-4xlarge' : idx === 1 ? 'text-quenza-3xlarge' : 'text-quenza-xlarge'}`}>
                                                    {formatCurrency(price.price, price.isUSD)}
                                                </span>
                                                <span className="text-quenza-small text-gray-500"> / {price.label}</span>
                                            </div>
                                        ))}
                                        <ul className="space-y-3 text-quenza-medium text-gray-600 border-t border-gray-100 pt-6">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-quenza-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleBuyTicket(plan.category)}
                                        className={plan.primary 
                                            ? 'quenza-btn-secondary w-full mt-8 py-3 rounded-quenza-lg font-quenza-bold text-center text-white' 
                                            : 'quenza-btn-outline w-full mt-8 py-3 rounded-quenza-lg font-quenza-semibold text-center'
                                        }
                                    >
                                        {plan.buttonLabel}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-quenza-active text-gray-400 py-10 border-t border-white/10 text-quenza-small">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-quenza-primary flex items-center justify-center text-gray-900 font-quenza-bold">Q</div>
                        <span className="text-white font-quenza-bold text-quenza-large">Quenza Conference System</span>
                    </div>
                    <p>© 2026 Quenza Conference System. Dikembangkan untuk Konsorsium Perguruan Tinggi Nasional.</p>
                </div>
            </footer>
        </div>
    );
}

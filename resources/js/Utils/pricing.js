/**
 * Utilitas pricing bersama — sumber tunggal untuk data paket registrasi.
 * Dipakai oleh PricingPage, LandingPage, dan halaman lain yang butuh daftar paket.
 *
 * Semua harga diambil dari DB (tabel ticket_pricing) via pricingMap;
 * nilai fallback hanya dipakai jika kategori belum ada di DB.
 */

export const FALLBACK_PRICES = {
    participant: { regular_price: 1500000, currency: 'IDR' },
    student: { regular_price: 500000, currency: 'IDR' },
    presiden: { regular_price: 5000000, currency: 'IDR' },
    author: { regular_price: 1500000, currency: 'IDR' },
    participant_online: { regular_price: 750000, currency: 'IDR' },
    student_online: { regular_price: 300000, currency: 'IDR' },
    international_participant: { regular_price: 20, currency: 'USD' },
    international_author: { regular_price: 40, currency: 'USD' },
    international_participant_online: { regular_price: 10, currency: 'USD' },
};

/**
 * Ubah koleksi ticket_pricing (dari backend) menjadi map per kategori.
 */
export const buildPricingMap = (ticketPricing = []) => {
    const pricingMap = {};
    ticketPricing.forEach((p) => {
        pricingMap[p.category] = {
            regular_price: p.regular_price || 0,
            late_price: p.late_price || 0,
            currency: p.currency || 'IDR',
        };
    });
    return pricingMap;
};

/**
 * Ambil harga satu kategori dari pricingMap, dengan fallback ke nilai default.
 */
export const getPriceFor = (pricingMap, category) =>
    pricingMap[category] || FALLBACK_PRICES[category] || { regular_price: 0, currency: 'IDR' };

/**
 * Daftar paket registrasi yang ditampilkan di pricing/landing.
 * Struktur: { title, subtitle, description, category, prices[], features[], primary }
 */
export const getPricingPlans = (ticketPricing = []) => {
    const pricingMap = buildPricingMap(ticketPricing);

    return [
        {
            title: 'Participant',
            subtitle: 'Offline',
            description: 'Untuk peserta yang menghadiri konferensi secara langsung.',
            category: 'participant',
            prices: [
                { label: 'Umum', ...getPriceFor(pricingMap, 'participant') },
                { label: 'Mahasiswa', ...getPriceFor(pricingMap, 'student') },
                { label: 'International', ...getPriceFor(pricingMap, 'international_participant') },
            ],
            features: [
                'Akses penuh selama konferensi',
                'Akses ke seluruh sesi dan workshop',
                'Sertifikat peserta',
            ],
            primary: false,
        },
        {
            title: 'Presenter',
            subtitle: 'Pemakalah',
            description: 'Untuk peserta yang mempresentasikan makalah.',
            category: 'author',
            prices: [
                { label: 'Dosen/Alumni', ...getPriceFor(pricingMap, 'presiden') },
                { label: 'Mahasiswa', ...getPriceFor(pricingMap, 'author') },
                { label: 'International', ...getPriceFor(pricingMap, 'international_author') },
            ],
            features: [
                'Akses penuh selama konferensi',
                'Kesempatan mempresentasikan makalah',
                'Publikasi dalam prosiding',
                'Sertifikat sebagai pemakalah',
                'Akses ke seluruh sesi dan workshop',
            ],
            primary: true,
        },
        {
            title: 'Participant',
            subtitle: 'Online',
            description: 'Untuk peserta yang mengikuti konferensi secara virtual.',
            category: 'participant_online',
            prices: [
                { label: 'Umum', ...getPriceFor(pricingMap, 'participant_online') },
                { label: 'Mahasiswa', ...getPriceFor(pricingMap, 'student_online') },
                { label: 'International', ...getPriceFor(pricingMap, 'international_participant_online') },
            ],
            features: [
                'Akses penuh konferensi secara daring',
                'Akses ke seluruh sesi dan workshop',
                'Sertifikat peserta',
            ],
            primary: false,
        },
    ];
};

/**
 * Format nominal sesuai currency: USD → "$ 20", IDR → "Rp 1.500.000".
 */
export const formatCurrency = (amount, currency = 'IDR') => {
    if (currency === 'USD') return '$ ' + new Intl.NumberFormat('en-US').format(amount);
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
};

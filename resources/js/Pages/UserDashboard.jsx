import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

export default function UserDashboard({ user }) {
    const getRoleInfo = (role) => {
        switch (role) {
            case 'super_admin':
                return {
                    label: 'Super Admin',
                    badgeClass: 'quenza-badge-role-admin',
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    desc: 'Anda memiliki akses penuh untuk mengelola konfigurasi, pengguna, jadwal, dan CMS konferensi.',
                    dashboardLink: '/admin/dashboard',
                    dashboardLabel: 'Buka Panel Admin',
                };
            case 'reviewer':
                return {
                    label: 'Reviewer / Mitra Bestari',
                    badgeClass: 'quenza-badge-role',
                    color: 'text-indigo-600',
                    bgColor: 'bg-indigo-50',
                    desc: 'Anda memiliki hak akses untuk menelaah naskah (*blind review*), memberikan skor kuantitatif (1-10), serta catatan evaluasi paper.',
                    dashboardLink: '/reviewer/dashboard',
                    dashboardLabel: 'Lihat Tugas Reviewer',
                    actionLabel: 'Lihat Semua Tugas',
                    actionLink: '/reviewer/reviews',
                };
            case 'author':
                return {
                    label: 'Author / Pemakalah',
                    badgeClass: 'quenza-badge-role',
                    color: 'text-teal-600',
                    bgColor: 'bg-teal-50',
                    desc: 'Anda dapat mengunggah abstrak, naskah lengkap (Full Paper), dan memantau status telaah secara berkala.',
                    dashboardLink: '/author/papers',
                    dashboardLabel: 'Kelola Paper Saya',
                    actionLabel: 'Submit Paper Baru',
                    actionLink: '/author/papers/submit',
                };
            case 'participant':
                return {
                    label: 'Participant / Peserta',
                    badgeClass: 'quenza-badge-role',
                    color: 'text-sky-600',
                    bgColor: 'bg-sky-50',
                    desc: 'Anda terdaftar sebagai peserta konferensi. Dalam halaman ini Anda dapat melihat tiket yang sudah dibeli dan informasi pembayaran.',
                    dashboardLink: '/user/tickets',
                    dashboardLabel: 'Lihat Tiket Saya',
                    actionLabel: 'Beli Tiket Baru',
                    actionLink: '/pricing',
                };
            default:
                return {
                    label: role,
                    badgeClass: 'quenza-badge-role',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    desc: 'Akun Anda aktif dalam sistem Quenza Conference.',
                    dashboardLink: '/portal',
                    dashboardLabel: 'Halaman Utama',
                    actionLabel: 'Kunjungi Beranda',
                    actionLink: '/',
                };
        }
    };

    const roleInfo = getRoleInfo(user?.role);

    return (
        <PublicLayout title={`Dashboard — ${roleInfo.label}`} subtitle={roleInfo.desc}>
            <Head title={`Dashboard — ${roleInfo.label}`} />

            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Success Banner */}
                <div className="bg-white rounded-quenza-xl border border-gray-200 p-8 text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-quenza-bold text-gray-900 mb-2">
                        Selamat Datang, {user?.name || 'Pengguna'}!
                    </h1>
                    <p className="text-quenza-medium text-gray-600 mb-4">{roleInfo.desc}</p>
                    <Link
                        href={roleInfo.dashboardLink}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-quenza-lg font-quenza-semibold text-white shadow-sm hover:brightness-105 transition-all ${
                            user?.role === 'super_admin'
                                ? 'bg-quenza-primary'
                                : 'bg-quenza-secondary'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        {roleInfo.dashboardLabel}
                    </Link>
                </div>

                {/* Account Info Card */}
                <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 mb-8">
                    <h2 className="text-quenza-medium font-quenza-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                        Informasi Akun
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-quenza-medium">
                        <div>
                            <span className="text-quenza-small font-quenza-medium text-gray-500 block">Nama Lengkap</span>
                            <span className="font-quenza-semibold text-gray-900">{user?.name || '-'}</span>
                        </div>
                        <div>
                            <span className="text-quenza-small font-quenza-medium text-gray-500 block">Email</span>
                            <span className="font-quenza-semibold text-gray-900">{user?.email || '-'}</span>
                        </div>
                        <div>
                            <span className="text-quenza-small font-quenza-medium text-gray-500 block">Username</span>
                            <span className="font-quenza-semibold text-gray-900">@{user?.username || '-'}</span>
                        </div>
                        <div>
                            <span className="text-quenza-small font-quenza-medium text-gray-500 block">Institusi</span>
                            <span className="font-quenza-semibold text-gray-900">{user?.institution || '-'}</span>
                        </div>
                        <div>
                            <span className="text-quenza-small font-quenza-medium text-gray-500 block">Role</span>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-quenza-small font-quenza-semibold ${roleInfo.bgColor} ${roleInfo.color}`}>
                                {roleInfo.label}
                            </span>
                        </div>
                        <div>
                            <span className="text-quenza-small font-quenza-medium text-gray-500 block">Status Akun</span>
                            <span className="mt-1 inline-block">
                                {user?.status === 'blocked' ? (
                                    <span className="quenza-badge-blocked">Blocked</span>
                                ) : user?.status === 'inactive' ? (
                                    <span className="quenza-badge-unverified">Inactive</span>
                                ) : (
                                    <span className="quenza-badge-active">Active</span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/profile"
                        className="bg-white rounded-quenza-xl border border-gray-200 p-5 hover:shadow-md transition-all"
                    >
                        <div className="w-10 h-10 rounded-quenza-lg bg-gray-100 flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 007-7z" />
                            </svg>
                        </div>
                        <p className="font-quenza-semibold text-gray-900">Profil Saya</p>
                        <p className="text-quenza-small text-gray-500 mt-1">Lihat dan edit profil</p>
                    </Link>

                    <Link
                        href="/"
                        className="bg-white rounded-quenza-xl border border-gray-200 p-5 hover:shadow-md transition-all"
                    >
                        <div className="w-10 h-10 rounded-quenza-lg bg-green-50 flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-quenza-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <p className="font-quenza-semibold text-gray-900">Kembali ke Beranda</p>
                        <p className="text-quenza-small text-gray-500 mt-1">Lihat halaman utama</p>
                    </Link>                    <Link
                    href={roleInfo.actionLink || '/payment'}
                    className="bg-white rounded-quenza-xl border border-gray-200 p-5 hover:shadow-md transition-all"
                >
                    <div className="w-10 h-10 rounded-quenza-lg bg-yellow-50 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="font-quenza-semibold text-gray-900">{roleInfo.actionLabel || 'Paket & Tiket'}</p>
                    <p className="text-quenza-small text-gray-500 mt-1">{roleInfo.actionLink === '/pricing' ? 'Lihat harga registrasi' : roleInfo.actionLink === '/payment' ? 'Pilih paket dan bayar tiket' : roleInfo.actionLabel === 'Submit Paper Baru' ? 'Submit paper pertama Anda' : roleInfo.actionLabel === 'Lihat Tiket Saya' ? 'Lihat tiket yang sudah dibeli' : 'Lihat halaman terkait'}</p>
                </Link>

                    <button
                        onClick={() => router.post('/logout')}
                        className="bg-white rounded-quenza-xl border border-red-200 text-red-600 p-5 hover:bg-red-50 transition-all"
                    >
                        <div className="w-10 h-10 rounded-quenza-lg bg-red-50 flex items-center justify-center mb-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <p className="font-quenza-semibold">Keluar (Logout)</p>
                        <p className="text-quenza-small text-gray-500 mt-1">Keluar dari akun</p>
                    </button>
                </div>
            </div>
        </PublicLayout>
    );
}

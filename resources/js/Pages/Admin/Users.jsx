import React, { useState, useMemo, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import EditUserModal from '../../Components/Admin/EditUserModal';
import UserConfirmationModal from '../../Components/Admin/UserConfirmationModal';

export default function Users({ users = [], stats = {} }) {
    const { flash } = usePage().props;

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');

    // Pagination state (10, 15, 20)
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Modals state
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        type: 'verify', // 'verify' | 'block' | 'unblock'
        user: null,
    });

    // Loading states
    const [isActionProcessing, setIsActionProcessing] = useState(false);
    const [isReloading, setIsReloading] = useState(false);

    // Toast notification state
    const [toast, setToast] = useState({
        show: false,
        type: 'success', // 'success' | 'error' | 'info'
        title: '',
        message: '',
    });

    // Reset pagination to page 1 whenever search, filter, or perPage changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter, perPage]);

    // Watch for incoming flash messages from Laravel
    useEffect(() => {
        if (flash?.success) {
            showToast('success', 'Berhasil', flash.success);
        } else if (flash?.error) {
            showToast('error', 'Gagal', flash.error);
        }
    }, [flash]);

    // Toast helper with auto-dismiss
    const showToast = (type, title, message) => {
        setToast({ show: true, type, title, message });
        const timer = setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 4500);
        return () => clearTimeout(timer);
    };

    // Filter pills options matching UI design
    const filterTabs = [
        { key: 'Semua', label: 'Semua' },
        { key: 'participant', label: 'Participant' },
        { key: 'author', label: 'Author' },
        { key: 'reviewer', label: 'Reviewer' },
        { key: 'verified', label: 'Verified' },
        { key: 'non-verified', label: 'Non-Verified' },
    ];

    // Filtered users list based on live search and active filter
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            // Search filter (name, email, institution)
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !query ||
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                (user.institution && user.institution.toLowerCase().includes(query));

            if (!matchesSearch) return false;

            // Category pill filter
            if (activeFilter === 'Semua') return true;
            if (activeFilter === 'participant') return user.role === 'participant';
            if (activeFilter === 'author') return user.role === 'author';
            if (activeFilter === 'reviewer') return user.role === 'reviewer';
            if (activeFilter === 'verified') return Boolean(user.is_verified);
            if (activeFilter === 'non-verified') return !user.is_verified;

            return true;
        });
    }, [users, searchQuery, activeFilter]);

    // Pagination calculations
    const totalItems = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalItems);

    const paginatedUsers = useMemo(() => {
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, startIndex, endIndex]);

    // Error parser per HTTP code
    const handleHttpError = (errorResponse, defaultMsg = 'Terjadi kesalahan sistem.') => {
        const status = errorResponse?.status;
        switch (status) {
            case 403:
                showToast('error', 'Akses Ditolak (403)', 'Anda tidak memiliki hak akses untuk mengubah atau memblokir pengguna ini.');
                break;
            case 404:
                showToast('error', 'Tidak Ditemukan (404)', 'Data pengguna yang dipilih tidak ditemukan dalam sistem.');
                break;
            case 419:
                showToast('error', 'Sesi Kedaluwarsa (419)', 'Sesi login Anda telah berakhir. Silakan muat ulang halaman atau login kembali.');
                break;
            case 422:
                showToast('error', 'Validasi Gagal (422)', 'Data yang dikirimkan tidak sesuai dengan kriteria validasi.');
                break;
            case 500:
                showToast('error', 'Kesalahan Server (500)', 'Terjadi kendala pada server internal. Silakan coba kembali beberapa saat lagi.');
                break;
            case 503:
                showToast('error', 'Layanan Tidak Tersedia (503)', 'Server sedang dalam pemeliharaan. Silakan coba lagi nanti.');
                break;
            default:
                showToast('error', 'Gagal Memproses', defaultMsg);
                break;
        }
    };

    // Reload action
    const handleReload = () => {
        setIsReloading(true);
        router.reload({
            only: ['users', 'stats'],
            onSuccess: () => {
                showToast('info', 'Data Diperbarui', 'Daftar data pengguna berhasil dimuat ulang secara segar.');
            },
            onError: (err) => {
                handleHttpError(err, 'Gagal memuat ulang data pengguna.');
            },
            onFinish: () => {
                setIsReloading(false);
            },
        });
    };

    // Trigger confirmation modal for verification
    const handlePromptVerification = (user) => {
        setConfirmationModal({
            isOpen: true,
            type: 'verify',
            user,
        });
    };

    // Trigger confirmation modal for block / unblock
    const handlePromptStatusToggle = (user) => {
        setConfirmationModal({
            isOpen: true,
            type: user.status === 'active' ? 'block' : 'unblock',
            user,
        });
    };

    // Execute verified action after modal confirmation
    const handleExecuteConfirmation = (reason = '') => {
        const { type, user } = confirmationModal;
        if (!user) return;

        setIsActionProcessing(true);

        if (type === 'verify') {
            router.post(
                `/admin/users/${user.id}/toggle-verification`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmationModal({ isOpen: false, type: 'verify', user: null });
                        showToast('success', 'Verifikasi Berhasil', `Akun "${user.name}" telah berhasil diverifikasi.`);
                    },
                    onError: (errors) => {
                        const msg = Object.values(errors).join(', ') || 'Gagal mengubah status verifikasi.';
                        showToast('error', 'Gagal Verifikasi', msg);
                    },
                    onFinish: () => {
                        setIsActionProcessing(false);
                    },
                }
            );
        } else if (type === 'block' || type === 'unblock') {
            router.post(
                `/admin/users/${user.id}/toggle-status`,
                { reason },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmationModal({ isOpen: false, type: 'verify', user: null });
                        const actionLabel = type === 'block' ? 'dinonaktifkan (Blocked)' : 'diaktifkan kembali (Active)';
                        showToast('success', 'Status Akses Diperbarui', `Akun "${user.name}" telah berhasil ${actionLabel}.`);
                    },
                    onError: (errors) => {
                        const msg = Object.values(errors).join(', ') || 'Gagal mengubah status akses.';
                        showToast('error', 'Gagal Mengubah Status', msg);
                    },
                    onFinish: () => {
                        setIsActionProcessing(false);
                    },
                }
            );
        }
    };

    // Role badge helper with project classes
    const getRoleBadge = (role) => {
        switch (role) {
            case 'author':
                return <span className="quenza-badge-role">Author</span>;
            case 'reviewer':
                return <span className="quenza-badge-role">Reviewer</span>;
            case 'participant':
                return <span className="quenza-badge-role">Participant</span>;
            case 'super_admin':
                return <span className="quenza-badge-role-admin">Super Admin</span>;
            default:
                return <span className="quenza-badge-role capitalize">{role}</span>;
        }
    };

    return (
        <AdminLayout
            title="Manajemen Pengguna"
            subtitle="Verifikasi akun, ubah role, dan kelola akses"
        >
            <Head title="Manajemen Pengguna" />

            {/* Floating Toast Notification */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-fadeIn">
                    <div
                        className={`rounded-quenza-xl border p-4 shadow-xl flex items-start gap-3.5 backdrop-blur-xs ${
                            toast.type === 'success'
                                ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900'
                                : toast.type === 'error'
                                ? 'bg-red-50/95 border-red-300 text-red-900'
                                : 'bg-sky-50/95 border-sky-300 text-sky-900'
                        }`}
                    >
                        {/* Toast Icon */}
                        <div className="shrink-0 mt-0.5">
                            {toast.type === 'success' && (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                            {toast.type === 'error' && (
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            )}
                            {toast.type === 'info' && (
                                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Toast Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-quenza-medium font-quenza-bold leading-tight">
                                {toast.title}
                            </h4>
                            <p className="text-quenza-small mt-0.5 opacity-90 leading-relaxed">
                                {toast.message}
                            </p>
                        </div>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Card */}
            <div className="bg-white rounded-quenza-2xl border border-gray-200 shadow-xs p-6 sm:p-8 flex flex-col gap-6">
                {/* Search, Reload, and Filters Header */}
                <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                    {/* Left: Search Input + Reload button */}
                    <div className="flex items-center gap-3 flex-1 max-w-lg">
                        {/* Search Input with generous padding */}
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama atau email pengguna....."
                                style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
                                className="w-full rounded-quenza-lg border border-gray-200 bg-gray-50/50 py-2.5 text-quenza-medium text-quenza-text-primary placeholder:text-gray-400 focus:bg-white focus:border-quenza-primary focus:outline-none focus:ring-1 focus:ring-quenza-primary/30 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                                    title="Hapus pencarian"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Reload Button */}
                        <button
                            type="button"
                            onClick={handleReload}
                            disabled={isReloading}
                            className="quenza-btn-outline px-3.5 py-2.5 rounded-quenza-lg text-quenza-small font-quenza-medium border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-quenza-primary/50 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                            title="Muat ulang data pengguna"
                        >
                            <svg
                                className={`w-4 h-4 text-quenza-secondary ${isReloading ? 'animate-spin' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="hidden sm:inline">Reload</span>
                        </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        {filterTabs.map((tab) => {
                            const isActive = activeFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveFilter(tab.key)}
                                    className={`px-4 py-2.5 rounded-quenza-lg text-quenza-medium transition-all whitespace-nowrap cursor-pointer ${
                                        isActive
                                            ? 'bg-quenza-secondary text-white font-quenza-semibold shadow-xs'
                                            : 'bg-gray-100 text-quenza-text-secondary hover:text-quenza-text-primary hover:bg-gray-200/80 font-quenza-medium'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto rounded-quenza-xl border border-gray-100">
                    <table className="w-full text-left border-collapse text-quenza-medium">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/75 text-quenza-small font-quenza-bold text-gray-800 tracking-wider">
                                <th className="py-4 px-5">Nama</th>
                                <th className="py-4 px-5">EMAIL</th>
                                <th className="py-4 px-5">ROLE</th>
                                <th className="py-4 px-5">VERIFIKASI</th>
                                <th className="py-4 px-5">AKSES</th>
                                <th className="py-4 px-5 text-right sm:text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user, index) => {
                                    const isRowTinted = index % 2 === 1;
                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors ${
                                                isRowTinted ? 'bg-[#FAFBFD]' : 'bg-white'
                                            } hover:bg-emerald-50/30`}
                                        >
                                            {/* Nama */}
                                            <td className="py-4 px-5 font-quenza-semibold text-quenza-text-primary">
                                                <div className="flex items-center gap-3">
                                                    <span>{user.name}</span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-4 px-5 font-quenza-regular text-gray-600">
                                                {user.email}
                                            </td>

                                            {/* Role Badge */}
                                            <td className="py-4 px-5">
                                                {getRoleBadge(user.role)}
                                            </td>

                                            {/* Verifikasi Badge */}
                                            <td className="py-4 px-5">
                                                {user.is_verified ? (
                                                    <span className="quenza-badge-verified">
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="quenza-badge-unverified">
                                                        Non-Verified
                                                    </span>
                                                )}
                                            </td>

                                            {/* Akses Badge */}
                                            <td className="py-4 px-5">
                                                {user.status === 'blocked' ? (
                                                    <span className="quenza-badge-blocked">
                                                        Blocked
                                                    </span>
                                                ) : (
                                                    <span className="quenza-badge-active">
                                                        Active
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center justify-end sm:justify-center gap-2">
                                                    {/* Quick Verify Button with Modal Prompt */}
                                                    {!user.is_verified && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePromptVerification(user)}
                                                            className="text-quenza-primary hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                                                            title="Verifikasi Akun"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    {/* Edit Button (Opens Edit Data / Role Modal) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedUserForEdit(user);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="text-quenza-ai hover:text-indigo-800 p-1.5 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                                                        title="Edit Data / Role Pengguna"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    {/* Block / Unblock Access Button with Modal Prompt */}
                                                    {user.role !== 'super_admin' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePromptStatusToggle(user)}
                                                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                                user.status === 'blocked'
                                                                    ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                                                                    : 'text-quenza-danger hover:text-red-800 hover:bg-red-50'
                                                            }`}
                                                            title={user.status === 'blocked' ? 'Buka Blokir Akses' : 'Blokir Akses'}
                                                        >
                                                            {user.status === 'blocked' ? (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-quenza-text-secondary">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="font-quenza-medium">Tidak ada pengguna yang cocok dengan kriteria pencarian.</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setActiveFilter('Semua');
                                                }}
                                                className="text-quenza-small font-quenza-semibold text-quenza-secondary hover:underline mt-1 cursor-pointer"
                                            >
                                                Reset Filter & Pencarian
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
                    {/* Left: Summary & Per Page Dropdown */}
                    <div className="flex flex-wrap items-center gap-4 text-quenza-small text-gray-600">
                        <div>
                            Menampilkan{' '}
                            <span className="font-quenza-semibold text-gray-900">
                                {totalItems > 0 ? startIndex + 1 : 0}
                            </span>{' '}
                            -{' '}
                            <span className="font-quenza-semibold text-gray-900">
                                {endIndex}
                            </span>{' '}
                            dari{' '}
                            <span className="font-quenza-semibold text-gray-900">
                                {totalItems}
                            </span>{' '}
                            pengguna
                        </div>

                        <div className="flex items-center gap-2">
                            <label htmlFor="per-page-select" className="text-gray-500 text-quenza-small">
                                Tampilkan:
                            </label>
                            <select
                                id="per-page-select"
                                value={perPage}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                                className="rounded-quenza-md border border-gray-200 bg-gray-50/75 hover:bg-white px-2.5 py-1 text-quenza-small font-quenza-semibold text-gray-800 focus:border-quenza-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-quenza-primary/30 transition-all cursor-pointer shadow-2xs"
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <span className="text-gray-500 text-quenza-small">per halaman</span>
                        </div>
                    </div>

                    {/* Right: Page Navigation */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5">
                            {/* Previous Button */}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-quenza-md border text-quenza-small font-quenza-medium transition-all ${
                                    currentPage === 1
                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-quenza-primary/40 cursor-pointer shadow-2xs'
                                }`}
                                title="Halaman Sebelumnya"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                const isCurrent = pageNum === currentPage;
                                return (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-quenza-md text-quenza-small transition-all flex items-center justify-center cursor-pointer ${
                                            isCurrent
                                                ? 'bg-quenza-secondary text-white font-quenza-bold shadow-xs'
                                                : 'text-gray-700 hover:bg-gray-100 font-quenza-medium border border-gray-200'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {/* Next Button */}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-quenza-md border text-quenza-small font-quenza-medium transition-all ${
                                    currentPage === totalPages
                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-quenza-primary/40 cursor-pointer shadow-2xs'
                                }`}
                                title="Halaman Berikutnya"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit User / Role Modal */}
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUserForEdit}
                onSaved={(msg) => showToast('success', 'Data Disimpan', msg)}
                onErrorNotify={(msg) => showToast('error', 'Validasi Gagal', msg)}
            />

            {/* Confirmation Modal for Verification & Access Toggle */}
            <UserConfirmationModal
                isOpen={confirmationModal.isOpen}
                type={confirmationModal.type}
                user={confirmationModal.user}
                processing={isActionProcessing}
                onClose={() => setConfirmationModal({ isOpen: false, type: 'verify', user: null })}
                onConfirm={handleExecuteConfirmation}
            />
        </AdminLayout>
    );
}

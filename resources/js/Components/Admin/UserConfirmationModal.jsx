import React, { useState, useEffect } from 'react';

export default function UserConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    type = 'block', // 'block' | 'unblock' | 'verify' | 'edit_confirm'
    user,
    processing = false,
}) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReason('');
        }
    }, [isOpen]);

    if (!isOpen || !user) return null;

    const handleConfirm = () => {
        if (type === 'block') {
            onConfirm(reason);
        } else {
            onConfirm();
        }
    };

    // Render exact layout from mockup when type === 'block'
    if (type === 'block') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
                <div
                    className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 flex flex-col gap-4 relative animate-scaleUp text-left"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="border-b border-gray-100 pb-3 -mt-1">
                        <h3 className="text-xl sm:text-2xl font-quenza-bold text-gray-900 tracking-tight">
                            Blokir Akses Pengguna
                        </h3>
                    </div>

                    {/* Subtitle / Description with bold name */}
                    <p className="text-quenza-medium text-gray-600 leading-relaxed">
                        Memblokir <span className="font-quenza-bold text-gray-900">{user.name}</span> akan mencabut sesi login aktif & mengirim email notifikasi penangguhan.
                    </p>

                    {/* Alasan Pemblokiran Field */}
                    <div className="flex flex-col gap-2 mt-1">
                        <label
                            htmlFor="block-reason"
                            className="text-quenza-medium font-quenza-semibold text-[#164E43]"
                        >
                            Alasan Pemblokiran
                        </label>
                        <textarea
                            id="block-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Tuliskan alasan..."
                            rows="4"
                            className="w-full rounded-xl border border-gray-300 bg-white p-3.5 text-quenza-medium text-gray-800 placeholder-gray-400 focus:border-quenza-primary focus:outline-none focus:ring-1 focus:ring-quenza-primary/30 transition-all resize-none"
                            disabled={processing}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="bg-[#E8F6F0] hover:bg-[#D8F0E5] text-[#0E5C4A] font-quenza-semibold text-quenza-medium px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={processing}
                            className="bg-[#C93535] hover:bg-[#B72C2C] text-white font-quenza-semibold text-quenza-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                'Blokir Pengguna'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Modal configurations for other types (unblock, verify, edit_confirm)
    const modalConfig = {
        verify: {
            title: 'Konfirmasi Verifikasi Akun',
            description: `Apakah Anda yakin ingin memverifikasi akun "${user.name}"? Pengguna akan mendapatkan tanda pengenal resmi dan akses penuh sebagai akun terverifikasi.`,
            confirmText: 'Ya, Verifikasi Akun',
            confirmButtonClass: 'quenza-btn-secondary text-white',
            iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
        unblock: {
            title: 'Konfirmasi Aktifkan Kembali Akun',
            description: `Apakah Anda yakin ingin membuka blokir dan mengaktifkan kembali akun "${user.name}"? Pengguna akan dapat login dan menggunakan platform kembali.`,
            confirmText: 'Ya, Aktifkan Akun',
            confirmButtonClass: 'quenza-btn-secondary text-white',
            iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            ),
        },
        edit_confirm: {
            title: 'Konfirmasi Perubahan Data',
            description: 'Apakah Anda yakin ingin menyimpan perubahan data dan role untuk pengguna ini?',
            confirmText: 'Ya, Simpan Perubahan',
            confirmButtonClass: 'quenza-btn-secondary text-white',
            iconBg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
    };

    const config = modalConfig[type] || modalConfig.verify;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div
                className="bg-white rounded-quenza-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-7 flex flex-col gap-5 relative animate-scaleUp text-left"
                role="dialog"
                aria-modal="true"
            >
                {/* Header with Icon */}
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${config.iconBg}`}>
                        {config.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-quenza-xlarge font-quenza-bold text-gray-900 leading-snug">
                            {config.title}
                        </h3>
                        <p className="text-quenza-small text-gray-600 mt-1.5 leading-relaxed">
                            {config.description}
                        </p>
                    </div>
                </div>

                {/* Target User Info Summary Box */}
                <div className="bg-gray-50/80 rounded-quenza-lg p-3.5 border border-gray-200/80 flex flex-col gap-1.5 text-quenza-small">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-quenza-medium">Nama Pengguna:</span>
                        <span className="font-quenza-semibold text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-quenza-medium">Email:</span>
                        <span className="font-quenza-regular text-gray-700">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-quenza-medium">Role Saat Ini:</span>
                        <span className="font-quenza-semibold uppercase text-quenza-secondary">{user.role}</span>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="quenza-btn-outline text-quenza-medium font-quenza-medium px-5 py-2.5 rounded-quenza-md hover:bg-gray-100 border border-gray-300 text-gray-700 transition-colors cursor-pointer"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={processing}
                        className={`px-5 py-2.5 rounded-quenza-md font-quenza-semibold text-quenza-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${config.confirmButtonClass}`}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Memproses...
                            </>
                        ) : (
                            config.confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

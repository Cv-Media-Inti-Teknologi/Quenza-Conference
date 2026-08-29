import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function EditUserModal({ isOpen, onClose, user, onSaved, onErrorNotify }) {
    if (!isOpen || !user) return null;

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: user.name || '',
        role: user.role || 'participant',
        institution: user.institution || '',
        phone: user.phone || '',
        expertise: user.expertise || '',
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (user) {
            clearErrors();
            setData({
                name: user.name || '',
                role: user.role || 'participant',
                institution: user.institution || '',
                phone: user.phone || '',
                expertise: user.expertise || '',
            });
        }
    }, [user]);

    const roleOptions = [
        { value: 'participant', label: 'Participant' },
        { value: 'author', label: 'Author' },
        { value: 'reviewer', label: 'Reviewer' },
        ...(user.role === 'super_admin' ? [{ value: 'super_admin', label: 'Super Admin' }] : []),
    ];

    const currentRoleLabel = roleOptions.find(opt => opt.value === data.role)?.label || 'Pilih Role';

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                if (onSaved) onSaved(`Data pengguna "${data.name}" berhasil disimpan.`);
            },
            onError: (errs) => {
                const errorSummary = Object.values(errs).join(', ') || 'Terjadi kesalahan saat memvalidasi data.';
                if (onErrorNotify) {
                    onErrorNotify(`Validasi Gagal (422): ${errorSummary}`);
                }
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div
                className="bg-white rounded-quenza-2xl border border-gray-200 shadow-quenza-modal max-w-md w-full p-6 sm:p-7 flex flex-col gap-6 relative animate-scaleUp"
                role="dialog"
                aria-modal="true"
            >
                {/* Modal Title */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary">
                        Edit Data / Role Pengguna
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer"
                        title="Tutup"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Field 1: Nama Pengguna */}
                    <div>
                        <label className="block text-quenza-medium font-quenza-medium text-quenza-text-primary mb-2">
                            Nama Pengguna <span className="text-quenza-danger">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama pengguna"
                            className={`quenza-input py-2.5 px-3.5 ${errors.name ? 'border-quenza-danger ring-1 ring-quenza-danger' : ''}`}
                            required
                        />
                        {errors.name && (
                            <p className="text-quenza-small text-quenza-danger mt-1.5 font-quenza-medium flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Field 2: Role (Custom Dropdown matching Screenshot) */}
                    <div className="relative">
                        <label className="block text-quenza-medium font-quenza-medium text-quenza-text-primary mb-2">
                            Role <span className="text-quenza-danger">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="quenza-input py-2.5 px-3.5 flex items-center justify-between text-left cursor-pointer bg-white"
                        >
                            <span className="text-quenza-medium text-quenza-text-primary font-quenza-regular">
                                {currentRoleLabel}
                            </span>
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Options Box */}
                        {isDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-quenza-md shadow-quenza-dropdown z-30 py-1 overflow-hidden animate-fadeIn">
                                {roleOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setData('role', opt.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-quenza-medium transition-colors cursor-pointer ${
                                            data.role === opt.value
                                                ? 'bg-emerald-50 font-quenza-semibold text-quenza-secondary'
                                                : 'text-quenza-text-primary hover:bg-gray-50 font-quenza-regular'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {errors.role && (
                            <p className="text-quenza-small text-quenza-danger mt-1.5 font-quenza-medium flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Email info display (read only) */}
                    <div className="bg-gray-50 rounded-quenza-md p-3 text-quenza-small text-quenza-text-secondary border border-gray-100 flex items-center justify-between">
                        <span className="font-quenza-semibold text-gray-700">Email Akun:</span>
                        <span className="text-gray-600">{user.email}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="quenza-btn-outline text-quenza-medium font-quenza-medium px-5 py-2.5 rounded-quenza-md cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="quenza-btn-secondary text-quenza-medium font-quenza-semibold px-6 py-2.5 rounded-quenza-md shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

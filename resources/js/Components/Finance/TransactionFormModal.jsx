import React, { useState } from 'react';

export default function TransactionFormModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        type: 'registration',
        description: '',
        amount: '',
        payment_method: 'transfer',
        reference_code: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('/admin/api/finance/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrors(data.errors || { general: 'Terjadi kesalahan' });
                return;
            }

            setFormData({
                type: 'registration',
                description: '',
                amount: '',
                payment_method: 'transfer',
                reference_code: '',
            });
            onSuccess?.();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ general: 'Gagal menambahkan pemasukan' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-quenza-xl shadow-quenza-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                        Tambah Pemasukan
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-quenza-md text-quenza-small">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Tipe Pemasukan
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`w-full quenza-input px-3 py-2 text-quenza-medium ${
                                errors.type ? 'border-red-500' : ''
                            }`}
                        >
                            <option value="registration">Registrasi</option>
                            <option value="sponsorship">Sponsorship</option>
                            <option value="grant">Hibah</option>
                            <option value="other">Lainnya</option>
                        </select>
                        {errors.type && <p className="text-red-500 text-quenza-small mt-1">{errors.type}</p>}
                    </div>

                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Deskripsi
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Contoh: Pembayaran registrasi peserta"
                            className={`w-full quenza-input px-3 py-2 text-quenza-medium ${
                                errors.description ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.description && <p className="text-red-500 text-quenza-small mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Nominal (Rp) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            step="1000"
                            className={`w-full quenza-input px-3 py-2 text-quenza-medium ${
                                errors.amount ? 'border-red-500' : ''
                            }`}
                            required
                        />
                        {errors.amount && <p className="text-red-500 text-quenza-small mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Metode Pembayaran
                        </label>
                        <select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                        >
                            <option value="transfer">Transfer Bank</option>
                            <option value="virtual_account">Virtual Account</option>
                            <option value="qris">QRIS</option>
                            <option value="cash">Tunai</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Kode Referensi (opsional)
                        </label>
                        <input
                            type="text"
                            name="reference_code"
                            value={formData.reference_code}
                            onChange={handleChange}
                            placeholder="Contoh: TRX-2026-001"
                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-quenza-md text-quenza-medium font-quenza-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 quenza-btn-primary text-quenza-medium font-quenza-medium disabled:opacity-50"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan Pemasukan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

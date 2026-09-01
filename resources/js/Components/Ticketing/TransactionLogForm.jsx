import React, { useState } from 'react';

export default function TransactionLogForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        transaction_name: '',
        amount: '',
        counterparty_name: '',
        type: 'income',
        transaction_date: new Date().toISOString().split('T')[0],
        transaction_time: new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        category: 'online',
        payment_method: '',
        description: '',
        receipt_url: '',
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
            const response = await fetch('/admin/api/ticketing/logs', {
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
                transaction_name: '',
                amount: '',
                counterparty_name: '',
                type: 'income',
                transaction_date: new Date().toISOString().split('T')[0],
                transaction_time: new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                category: 'online',
                payment_method: '',
                description: '',
                receipt_url: '',
            });
            onSuccess?.();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ general: 'Gagal menambahkan data transaksi' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quenza-card rounded-quenza-xl p-6">
            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-6">
                Pendataan Penjualan / Pengurangan Manual
            </h3>

            {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-quenza-md text-quenza-small mb-4">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Nama Transaksi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="transaction_name"
                            value={formData.transaction_name}
                            onChange={handleChange}
                            placeholder="Contoh: Pembayaran Venue"
                            className={`w-full quenza-input px-3 py-2 text-quenza-medium ${
                                errors.transaction_name ? 'border-red-500' : ''
                            }`}
                            required
                        />
                        {errors.transaction_name && <p className="text-red-500 text-quenza-small mt-1">{errors.transaction_name}</p>}
                    </div>
                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Nominal Dana (Rp) <span className="text-red-500">*</span>
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
                </div>

                {/* Row 2 */}
                <div>
                    <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                        Nama Pihak yang Berinteraksi <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="counterparty_name"
                        value={formData.counterparty_name}
                        onChange={handleChange}
                        placeholder="Contoh: PT Venue Bersama"
                        className={`w-full quenza-input px-3 py-2 text-quenza-medium ${
                            errors.counterparty_name ? 'border-red-500' : ''
                        }`}
                        required
                    />
                    {errors.counterparty_name && <p className="text-red-500 text-quenza-small mt-1">{errors.counterparty_name}</p>}
                </div>

                {/* Row 3 */}
                <div>
                    <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                        Jenis Transaksi <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="income"
                                checked={formData.type === 'income'}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <span className="text-quenza-medium text-quenza-text-primary">Pemasukan</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="expense"
                                checked={formData.type === 'expense'}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <span className="text-quenza-medium text-quenza-text-primary">Pengurangan</span>
                        </label>
                    </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Tanggal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="transaction_date"
                            value={formData.transaction_date}
                            onChange={handleChange}
                            className={`w-full quenza-input px-3 py-2 text-quenza-medium ${
                                errors.transaction_date ? 'border-red-500' : ''
                            }`}
                            required
                        />
                        {errors.transaction_date && <p className="text-red-500 text-quenza-small mt-1">{errors.transaction_date}</p>}
                    </div>
                    <div>
                        <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                            Waktu
                        </label>
                        <input
                            type="time"
                            name="transaction_time"
                            value={formData.transaction_time}
                            onChange={handleChange}
                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                        />
                    </div>
                </div>

                {/* Row 5 */}
                <div>
                    <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                        Kategori <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {['online', 'hotel', 'venue', 'tiket_presenter', 'hibah_kampus', 'sponsor'].map((cat) => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    checked={formData.category === cat}
                                    onChange={handleChange}
                                    className="w-4 h-4"
                                />
                                <span className="text-quenza-medium text-quenza-text-primary capitalize">
                                    {cat.replace('_', ' ')}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Row 6 */}
                <div>
                    <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                        Metode Pembayaran
                    </label>
                    <input
                        type="text"
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        placeholder="Contoh: Transfer Bank, Tunai, Cek"
                        className="w-full quenza-input px-3 py-2 text-quenza-medium"
                    />
                </div>

                {/* Row 7 */}
                <div>
                    <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                        Keterangan
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detail transaksi (opsional)"
                        rows="3"
                        className="w-full quenza-input px-3 py-2 text-quenza-medium resize-none"
                    />
                </div>

                {/* Row 8 */}
                <div>
                    <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                        Keterangan (Upload File / URL Bukti)
                    </label>
                    <input
                        type="text"
                        name="receipt_url"
                        value={formData.receipt_url}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full quenza-input px-3 py-2 text-quenza-medium"
                    />
                    <p className="text-quenza-small text-quenza-text-secondary mt-1">
                        💡 Masukkan URL link bukti transaksi (foto struk, invoice, dll)
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="reset"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-quenza-md text-quenza-medium font-quenza-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 quenza-btn-primary text-quenza-medium font-quenza-medium disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </div>
            </form>
        </div>
    );
}

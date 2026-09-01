import React, { useState, useEffect } from 'react';

export default function TicketPricingForm({ initialData, onSuccess }) {
    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setPricing(initialData);
        } else {
            fetchPricing();
        }
    }, [initialData]);

    const fetchPricing = async () => {
        try {
            const response = await fetch('/admin/api/ticketing/pricing');
            const data = await response.json();
            setPricing(data);
        } catch (error) {
            console.error('Error fetching pricing:', error);
        }
    };

    const handlePriceChange = (index, field, value) => {
        const updated = [...pricing];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setPricing(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('/admin/api/ticketing/pricing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    pricing: pricing.map(p => ({
                        id: p.id,
                        regular_price: parseInt(p.regular_price),
                        late_price: p.late_price ? parseInt(p.late_price) : null,
                    })),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrors(data.errors || { general: 'Terjadi kesalahan' });
                return;
            }

            onSuccess?.();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ general: 'Gagal mengupdate harga tiket' });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID').format(parseInt(value));
    };

    return (
        <div className="quenza-card rounded-quenza-xl p-6">
            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-6">
                Atur Biaya Pendaftaran
            </h3>

            {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-quenza-md text-quenza-small mb-4">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-3 px-4 text-quenza-small font-quenza-semibold text-quenza-text-primary">
                                    Pilih Kategori
                                </th>
                                <th className="py-3 px-4 text-quenza-small font-quenza-semibold text-quenza-text-primary">
                                    Biaya Regular (Rp)
                                </th>
                                <th className="py-3 px-4 text-quenza-small font-quenza-semibold text-quenza-text-primary">
                                    Biaya Late (Rp)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricing.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50/50">
                                    <td className="py-4 px-4">
                                        <span className="text-quenza-medium font-quenza-semibold text-quenza-text-primary capitalize">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <input
                                            type="number"
                                            value={item.regular_price}
                                            onChange={(e) => handlePriceChange(idx, 'regular_price', e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            step="1000"
                                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                                        />
                                        {item.regular_price && (
                                            <p className="text-quenza-small text-quenza-text-secondary mt-1">
                                                Rp {formatCurrency(item.regular_price)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <input
                                            type="number"
                                            value={item.late_price || ''}
                                            onChange={(e) => handlePriceChange(idx, 'late_price', e.target.value)}
                                            placeholder="0 (opsional)"
                                            min="0"
                                            step="1000"
                                            className="w-full quenza-input px-3 py-2 text-quenza-medium"
                                        />
                                        {item.late_price && (
                                            <p className="text-quenza-small text-quenza-text-secondary mt-1">
                                                Rp {formatCurrency(item.late_price)}
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="quenza-btn-primary px-6 py-2 text-quenza-medium font-quenza-medium disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Update Biaya Pendaftaran'}
                    </button>
                </div>
            </form>
        </div>
    );
}

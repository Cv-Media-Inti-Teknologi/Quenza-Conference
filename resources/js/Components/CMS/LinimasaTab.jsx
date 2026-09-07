import React from 'react';
import { sanitizeText } from '../../Utils/sanitize';

export default function LinimasaTab({ data, setData, errors, onSave, onPreview, processing, onRequestDelete, onNotify }) {
    const dates = Array.isArray(data.important_dates) ? data.important_dates : [];

    const handleAddDate = () => {
        const newId = 'date-' + Date.now();
        const newDate = {
            id: newId,
            keterangan: '',
            title: '',
            tanggal: '',
            date_info: '',
            description: '',
            status: 'upcoming',
        };
        setData('important_dates', [...dates, newDate]);
        if (onNotify) {
            onNotify('Tanggal penting baru berhasil ditambahkan!');
        }
        setTimeout(() => {
            const el = document.getElementById(newId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const handleRemoveDate = (indexToRemove) => {
        const targetDate = dates[indexToRemove];
        const dateLabel = targetDate?.keterangan || targetDate?.title || `Tanggal ${indexToRemove + 1}`;

        if (onRequestDelete) {
            onRequestDelete({
                itemType: 'important_dates',
                index: indexToRemove,
                itemName: targetDate?.keterangan || targetDate?.title || `Tanggal ${indexToRemove + 1}`,
                title: `Hapus Tanggal "${dateLabel}"?`,
                message: `Agenda linimasa "${dateLabel}" akan dihapus dari jadwal tahapan konferensi.`,
                onConfirm: () => {
                    const updated = dates.filter((_, idx) => idx !== indexToRemove);
                    setData('important_dates', updated);
                },
            });
        } else {
            const updated = dates.filter((_, idx) => idx !== indexToRemove);
            setData('important_dates', updated);
        }
    };

    const handleFieldChange = (index, field, value) => {
        const updated = [...dates];
        const currentItem = updated[index];
        
        if (field === 'keterangan') {
            const cleanText = sanitizeText(value, 200);
            updated[index] = { ...currentItem, keterangan: cleanText, title: cleanText };
        } else if (field === 'tanggal') {
            const cleanDate = sanitizeText(value, 100);
            updated[index] = { ...currentItem, tanggal: cleanDate, date_info: cleanDate };
        } else {
            updated[index] = { ...currentItem, [field]: value };
        }
        
        setData('important_dates', updated);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Top Control Card */}
            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
                <p className="text-quenza-medium text-quenza-text-secondary">
                    Atur tanggal penting yang tampil di linimasa landing page.
                </p>

                {/* + Tambah Tanggal Button */}
                <button
                    type="button"
                    onClick={handleAddDate}
                    className="w-full py-3.5 px-4 border border-gray-400 hover:border-gray-500 rounded-quenza-lg text-quenza-medium font-quenza-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all text-center"
                >
                    + Tambah Tanggal
                </button>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={processing}
                        className="quenza-btn-outline text-quenza-medium font-quenza-medium px-6 py-2.5 rounded-quenza-md border border-gray-400 text-gray-700 hover:bg-gray-50 transition-all shadow-2xs flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan Perubahan'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onPreview}
                        className="text-quenza-medium font-quenza-semibold px-6 py-2.5 rounded-quenza-md bg-[#0E5C4A] hover:bg-[#0b4b3c] text-white transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview Konten Landing Page
                    </button>
                </div>
            </div>

            {/* Date Item Cards */}
            {dates.map((item, index) => (
                <div key={item.id || index} id={item.id} className="bg-white rounded-quenza-xl border border-gray-200 p-6 shadow-xs flex flex-col gap-5 transition-all">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <span className="text-quenza-medium font-quenza-medium text-gray-500">
                            Tanggal {index + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleRemoveDate(index)}
                            className="text-quenza-small font-quenza-semibold text-red-600 hover:text-red-800 transition-colors"
                        >
                            Hapus
                        </button>
                    </div>

                    {/* Form Inputs Grid (2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Keterangan */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                Keterangan
                            </label>
                            <input
                                type="text"
                                maxLength={200}
                                value={item.keterangan || item.title || ''}
                                onChange={(e) => handleFieldChange(index, 'keterangan', e.target.value)}
                                placeholder="Contoh: Registration Open"
                                className="quenza-input"
                            />
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                Tanggal
                            </label>
                            <input
                                type="text"
                                maxLength={100}
                                value={item.tanggal || item.date_info || ''}
                                onChange={(e) => handleFieldChange(index, 'tanggal', e.target.value)}
                                placeholder="Contoh: 1 Agu 2026"
                                className="quenza-input"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {dates.length === 0 && (
                <div className="bg-white rounded-quenza-xl border border-dashed border-gray-300 p-8 text-center text-quenza-text-secondary">
                    Belum ada tanggal penting yang ditambahkan. Klik tombol <strong className="text-gray-800">+ Tambah Tanggal</strong> di atas.
                </div>
            )}
        </div>
    );
}

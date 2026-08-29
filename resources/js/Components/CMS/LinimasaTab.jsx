import React from 'react';

export default function LinimasaTab({ data, setData, errors, onSave, onPreview, processing, onRequestDelete, onNotify }) {
    const dates = Array.isArray(data.important_dates) ? data.important_dates : [];

    const handleAddDate = () => {
        const newId = 'date-' + Date.now();
        const newDate = {
            id: newId,
            title: '',
            date_info: '',
            description: '',
            status: 'upcoming',
        };
        setData('important_dates', [...dates, newDate]);
        if (onNotify) {
            onNotify('Agenda linimasa baru berhasil ditambahkan!');
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
        const dateLabel = targetDate?.title ? `"${targetDate.title}"` : `Tahap ${indexToRemove + 1}`;

        if (onRequestDelete) {
            onRequestDelete({
                itemType: 'important_dates',
                index: indexToRemove,
                itemName: targetDate?.title || `Tahap ${indexToRemove + 1}`,
                title: `Hapus Tahap ${dateLabel}?`,
                message: `Agenda linimasa ${dateLabel} akan dihapus dari jadwal tahapan konferensi.`,
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
        updated[index] = { ...updated[index], [field]: value };
        setData('important_dates', updated);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Top Control Card */}
            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
                <p className="text-quenza-medium text-quenza-text-secondary">
                    Kelola linimasa tahapan penting konferensi.
                </p>

                {/* + Tambah Linimasa Button */}
                <button
                    type="button"
                    onClick={handleAddDate}
                    className="w-full py-3.5 px-4 border-2 border-dashed border-gray-300 hover:border-quenza-primary/80 rounded-quenza-lg text-quenza-medium font-quenza-semibold text-gray-700 hover:text-quenza-secondary hover:bg-green-50/40 transition-all text-center"
                >
                    + Tambah Linimasa / Tanggal Penting
                </button>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={processing}
                        className="quenza-btn-secondary text-quenza-medium font-quenza-semibold px-6 py-2.5 rounded-quenza-md text-white transition-all shadow-xs flex items-center justify-center gap-2"
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

                    <button
                        type="button"
                        onClick={onPreview}
                        className="quenza-btn-outline text-quenza-medium font-quenza-medium px-6 py-2.5 rounded-quenza-md hover:bg-gray-50 border border-gray-300 text-gray-700 transition-colors shadow-2xs flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-green-50 text-quenza-secondary font-quenza-bold text-quenza-small flex items-center justify-center border border-green-100">
                                {index + 1}
                            </span>
                            <h4 className="text-quenza-medium font-quenza-bold text-quenza-text-secondary tracking-wider uppercase">
                                TAHAP {index + 1}
                            </h4>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveDate(index)}
                            className="text-quenza-small font-quenza-semibold text-quenza-danger hover:text-red-700 hover:underline transition-colors"
                        >
                            Hapus
                        </button>
                    </div>

                    {/* Form Inputs Grid (2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Judul Kegiatan */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                Nama Tahap / Agenda <span className="text-quenza-danger font-bold ml-0.5">*</span>
                            </label>
                            <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                placeholder="Contoh: Batas Akhir Full Paper"
                                className="quenza-input"
                                required
                            />
                        </div>

                        {/* Tanggal / Batas Waktu */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                Tanggal / Rentang Waktu <span className="text-quenza-danger font-bold ml-0.5">*</span>
                            </label>
                            <input
                                type="text"
                                value={item.date_info || ''}
                                onChange={(e) => handleFieldChange(index, 'date_info', e.target.value)}
                                placeholder="Contoh: 15 Agustus 2026"
                                className="quenza-input"
                                required
                            />
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                Deskripsi Singkat <span className="text-quenza-danger font-bold ml-0.5">*</span>
                            </label>
                            <input
                                type="text"
                                value={item.description || ''}
                                onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                placeholder="Keterangan alur atau proses..."
                                className="quenza-input"
                                required
                            />
                        </div>

                        {/* Status Tahap */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                Status Pelaksanaan <span className="text-quenza-danger font-bold ml-0.5">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={item.status || 'upcoming'}
                                    onChange={(e) => handleFieldChange(index, 'status', e.target.value)}
                                    className="quenza-input pr-10 appearance-none bg-white cursor-pointer"
                                    required
                                >
                                    <option value="upcoming">Akan Datang (Upcoming)</option>
                                    <option value="ongoing">Sedang Berlangsung (Ongoing)</option>
                                    <option value="completed">Selesai (Completed)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {dates.length === 0 && (
                <div className="bg-white rounded-quenza-xl border border-dashed border-gray-300 p-8 text-center text-quenza-text-secondary">
                    Belum ada agenda linimasa yang ditambahkan. Klik tombol <strong className="text-gray-800">+ Tambah Linimasa</strong> di atas.
                </div>
            )}
        </div>
    );
}

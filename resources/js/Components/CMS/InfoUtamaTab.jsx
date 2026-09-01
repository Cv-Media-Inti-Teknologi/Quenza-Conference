import React from 'react';

export default function InfoUtamaTab({ data, setData, errors, onSave, onPreview, processing }) {
    return (
        <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            {/* Judul Konferensi */}
            <div>
                <label className="block text-quenza-medium font-quenza-medium text-quenza-text-secondary mb-2">
                    Judul Konferensi <span className="text-quenza-danger font-bold ml-0.5">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={data.conference_title || ''}
                    onChange={(e) => setData('conference_title', e.target.value)}
                    placeholder="Contoh: International Conference on Information Technology 2026"
                    className={`quenza-input ${errors.conference_title ? 'border-quenza-danger' : ''}`}
                />
                {errors.conference_title && (
                    <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.conference_title}</p>
                )}
            </div>

            {/* Tema */}
            <div>
                <label className="block text-quenza-medium font-quenza-medium text-quenza-text-secondary mb-2">
                    Tema <span className="text-quenza-danger font-bold ml-0.5">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={data.conference_theme || ''}
                    onChange={(e) => setData('conference_theme', e.target.value)}
                    placeholder="Contoh: AI for a Sustainable Future"
                    className={`quenza-input ${errors.conference_theme ? 'border-quenza-danger' : ''}`}
                />
                {errors.conference_theme && (
                    <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.conference_theme}</p>
                )}
            </div>

            {/* Deskripsi */}
            <div>
                <label className="block text-quenza-medium font-quenza-medium text-quenza-text-secondary mb-2">
                    Deskripsi <span className="text-quenza-danger font-bold ml-0.5">*</span>
                </label>
                <textarea
                    rows={4}
                    required
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Deskripsi singkat mengenai latar belakang dan tujuan konferensi..."
                    className={`quenza-input resize-y ${errors.description ? 'border-quenza-danger' : ''}`}
                />
                {errors.description && (
                    <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.description}</p>
                )}
            </div>

            {/* Tanggal & Edisi Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-quenza-medium font-quenza-medium text-quenza-text-secondary mb-2">
                        Tanggal <span className="text-quenza-danger font-bold ml-0.5">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={data.date_range || ''}
                        onChange={(e) => setData('date_range', e.target.value)}
                        placeholder="Contoh: 14–15 Okt 2026"
                        className={`quenza-input ${errors.date_range ? 'border-quenza-danger' : ''}`}
                    />
                    {errors.date_range && (
                        <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.date_range}</p>
                    )}
                </div>

                <div>
                    <label className="block text-quenza-medium font-quenza-medium text-quenza-text-secondary mb-2">
                        Edisi <span className="text-quenza-danger font-bold ml-0.5">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={data.edition || ''}
                        onChange={(e) => setData('edition', e.target.value)}
                        placeholder="Contoh: Edisi ke-8"
                        className={`quenza-input ${errors.edition ? 'border-quenza-danger' : ''}`}
                    />
                    {errors.edition && (
                        <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.edition}</p>
                    )}
                </div>
            </div>

            {/* Tempat */}
            <div>
                <label className="block text-quenza-medium font-quenza-medium text-quenza-text-secondary mb-2">
                    Tempat <span className="text-quenza-danger font-bold ml-0.5">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={data.location || ''}
                    onChange={(e) => setData('location', e.target.value)}
                    placeholder="Contoh: Grand Ballroom, Bali (Hybrid)"
                    className={`quenza-input ${errors.location ? 'border-quenza-danger' : ''}`}
                />
                {errors.location && (
                    <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.location}</p>
                )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
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
    );
}

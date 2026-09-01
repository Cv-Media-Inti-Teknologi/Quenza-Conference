import React, { useRef } from 'react';

export default function SpeakersTab({ data, setData, errors, onSave, onPreview, processing, onUploadMedia, onRequestDelete, onNotify }) {
    const fileInputRefs = useRef({});

    const speakers = Array.isArray(data.speakers) ? data.speakers : [];

    const handleAddSpeaker = () => {
        const newId = 'speaker-' + Date.now();
        const newSpeaker = {
            id: newId,
            name: '',
            affiliation: '',
            expertise: '',
            role: 'Keynote Speaker',
            avatar: '',
        };
        setData('speakers', [...speakers, newSpeaker]);
        if (onNotify) {
            onNotify('Speaker baru berhasil ditambahkan!');
        }
        setTimeout(() => {
            const el = document.getElementById(newId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const handleRemoveSpeaker = (indexToRemove) => {
        const targetSpeaker = speakers[indexToRemove];
        const speakerLabel = targetSpeaker?.name ? `"${targetSpeaker.name}"` : `Speaker ${indexToRemove + 1}`;

        if (onRequestDelete) {
            onRequestDelete({
                itemType: 'speakers',
                index: indexToRemove,
                itemName: targetSpeaker?.name || `Speaker ${indexToRemove + 1}`,
                title: `Hapus Speaker ${speakerLabel}?`,
                message: `Profil narasumber ${speakerLabel} akan dihapus dari daftar featured/keynote speakers landing page.`,
                onConfirm: () => {
                    const updated = speakers.filter((_, idx) => idx !== indexToRemove);
                    setData('speakers', updated);
                },
            });
        } else {
            const updated = speakers.filter((_, idx) => idx !== indexToRemove);
            setData('speakers', updated);
        }
    };

    const handleFieldChange = (index, field, value) => {
        const updated = [...speakers];
        updated[index] = { ...updated[index], [field]: value };
        setData('speakers', updated);
    };

    const handleAvatarSelect = async (index, event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Security validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format file tidak didukung. Silakan gunakan format JPG, PNG, WEBP, atau SVG.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran foto terlalu besar! Maksimal 2MB.');
            return;
        }

        // Live preview immediately
        const objectUrl = URL.createObjectURL(file);
        const updatedWithLocal = [...speakers];
        updatedWithLocal[index] = { ...updatedWithLocal[index], avatar: objectUrl };
        setData('speakers', updatedWithLocal);

        // Upload to server securely
        if (onUploadMedia) {
            try {
                const uploadedUrl = await onUploadMedia(file, 'speaker');
                if (uploadedUrl) {
                    const finalUpdated = [...speakers];
                    finalUpdated[index] = { ...finalUpdated[index], avatar: uploadedUrl };
                    setData('speakers', finalUpdated);
                }
            } catch (err) {
                console.error('Upload avatar failed:', err);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Top Control Card */}
            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
                <p className="text-quenza-medium text-quenza-text-secondary">
                    Kelola profil keynote speaker & honored guest.
                </p>

                {/* + Tambah Speaker Button */}
                <button
                    type="button"
                    onClick={handleAddSpeaker}
                    className="w-full py-3.5 px-4 border-2 border-dashed border-gray-300 hover:border-quenza-primary/80 rounded-quenza-lg text-quenza-medium font-quenza-semibold text-gray-700 hover:text-quenza-secondary hover:bg-green-50/40 transition-all text-center"
                >
                    + Tambah Speaker
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

            {/* Speaker Item Cards */}
            {speakers.map((speaker, index) => (
                <div key={speaker.id || index} id={speaker.id} className="bg-white rounded-quenza-xl border border-gray-200 p-6 shadow-xs flex flex-col gap-5 transition-all">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <h4 className="text-quenza-medium font-quenza-bold text-quenza-text-secondary tracking-wider uppercase">
                            SPEAKER {index + 1}
                        </h4>
                        <button
                            type="button"
                            onClick={() => handleRemoveSpeaker(index)}
                            className="text-quenza-small font-quenza-semibold text-quenza-danger hover:text-red-700 hover:underline transition-colors"
                        >
                            Hapus
                        </button>
                    </div>

                    {/* Content Layout */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar & Upload Button */}
                        <div className="flex flex-col items-center gap-3 shrink-0 self-center md:self-start">
                            <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 relative group shadow-2xs">
                                {speaker.avatar ? (
                                    <img
                                        src={speaker.avatar}
                                        alt={speaker.name || `Speaker ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={(el) => (fileInputRefs.current[index] = el)}
                                onChange={(e) => handleAvatarSelect(index, e)}
                                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRefs.current[index]?.click()}
                                className="quenza-btn-outline text-quenza-small font-quenza-medium px-3 py-1.5 rounded-quenza-md border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors inline-flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Unggah Gambar
                            </button>
                        </div>

                        {/* Form Inputs Grid (2 cols) */}
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Nama */}
                            <div>
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Nama <span className="text-quenza-danger font-bold ml-0.5">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={speaker.name || ''}
                                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                    placeholder="Contoh: Dr. Amira Sutanto"
                                    className="quenza-input"
                                    required
                                />
                            </div>

                            {/* Afiliasi */}
                            <div>
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Afiliasi <span className="text-quenza-danger font-bold ml-0.5">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={speaker.affiliation || ''}
                                    onChange={(e) => handleFieldChange(index, 'affiliation', e.target.value)}
                                    placeholder="Contoh: Universitas Indonesia"
                                    className="quenza-input"
                                    required
                                />
                            </div>

                            {/* Keahlian */}
                            <div>
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Keahlian <span className="text-quenza-danger font-bold ml-0.5">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={speaker.expertise || ''}
                                    onChange={(e) => handleFieldChange(index, 'expertise', e.target.value)}
                                    placeholder="Contoh: Sustainable AI Systems"
                                    className="quenza-input"
                                />
                            </div>

                            {/* Status Peran */}
                            <div>
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Status Peran <span className="text-quenza-danger font-bold ml-0.5">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={speaker.role || 'Keynote Speaker'}
                                        onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                                        className="quenza-input pr-10 appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="Keynote Speaker">Keynote Speaker</option>
                                        <option value="Invited Speaker">Invited Speaker</option>
                                        <option value="Honored Guest">Honored Guest</option>
                                        <option value="Panelist">Panelist</option>
                                        <option value="Session Chair">Session Chair</option>
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
                </div>
            ))}

            {speakers.length === 0 && (
                <div className="bg-white rounded-quenza-xl border border-dashed border-gray-300 p-8 text-center text-quenza-text-secondary">
                    Belum ada pembicara yang ditambahkan. Klik tombol <strong className="text-gray-800">+ Tambah Speaker</strong> di atas.
                </div>
            )}
        </div>
    );
}

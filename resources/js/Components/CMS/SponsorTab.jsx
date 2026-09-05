import React, { useRef } from 'react';
import { sanitizeUrl, sanitizeText } from '../../Utils/sanitize';

export default function SponsorTab({ data, setData, errors, onSave, onPreview, processing, onUploadMedia, onRequestDelete, onNotify }) {
    const fileInputRefs = useRef({});

    const sponsors = Array.isArray(data.sponsors) ? data.sponsors : [];

    const handleAddSponsor = () => {
        const newId = 'sponsor-' + Date.now();
        const newSponsor = {
            id: newId,
            name: '',
            tier: 'Platinum Sponsor',
            logo: '',
            website_url: '',
            description: '',
        };
        setData('sponsors', [...sponsors, newSponsor]);
        if (onNotify) {
            onNotify('Partner/Sponsor baru berhasil ditambahkan!');
        }
        setTimeout(() => {
            const el = document.getElementById(newId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const handleRemoveSponsor = (indexToRemove) => {
        const targetSponsor = sponsors[indexToRemove];
        const sponsorLabel = targetSponsor?.name ? `"${targetSponsor.name}"` : `Partner ${indexToRemove + 1}`;

        if (onRequestDelete) {
            onRequestDelete({
                itemType: 'sponsors',
                index: indexToRemove,
                itemName: targetSponsor?.name || `Partner ${indexToRemove + 1}`,
                title: `Hapus Partner ${sponsorLabel}?`,
                message: `Data sponsor/mitra ${sponsorLabel} akan dihapus dari daftar tampilan partner landing page.`,
                onConfirm: () => {
                    const updated = sponsors.filter((_, idx) => idx !== indexToRemove);
                    setData('sponsors', updated);
                },
            });
        } else {
            const updated = sponsors.filter((_, idx) => idx !== indexToRemove);
            setData('sponsors', updated);
        }
    };

    const handleFieldChange = (index, field, value) => {
        const updated = [...sponsors];
        let sanitizedValue = value;

        if (field === 'name') {
            sanitizedValue = sanitizeText(value, 150);
        } else if (field === 'description') {
            sanitizedValue = sanitizeText(value, 500);
        } else if (field === 'website_url') {
            sanitizedValue = typeof value === 'string' ? value.trim().slice(0, 500) : '';
        }

        updated[index] = { ...updated[index], [field]: sanitizedValue };
        setData('sponsors', updated);
    };

    const handleLogoSelect = async (index, event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Security validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format file tidak didukung. Silakan gunakan format JPG, PNG, WEBP, atau SVG.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file logo terlalu besar! Maksimal 2MB.');
            return;
        }

        // Live preview immediately
        const objectUrl = URL.createObjectURL(file);
        const updatedWithLocal = [...sponsors];
        updatedWithLocal[index] = { ...updatedWithLocal[index], logo: objectUrl };
        setData('sponsors', updatedWithLocal);

        // Upload to server securely
        if (onUploadMedia) {
            try {
                const uploadedUrl = await onUploadMedia(file, 'sponsor');
                if (uploadedUrl) {
                    const finalUpdated = [...sponsors];
                    finalUpdated[index] = { ...finalUpdated[index], logo: uploadedUrl };
                    setData('sponsors', finalUpdated);
                }
            } catch (err) {
                console.error('Upload logo failed:', err);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Top Control Card */}
            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
                <p className="text-quenza-medium text-quenza-text-secondary">
                    Kelola display sponsor dan mitra pendukung konferensi (sebanyak-N).
                </p>

                {/* + Tambah Sponsor Button */}
                <button
                    type="button"
                    onClick={handleAddSponsor}
                    className="w-full py-3.5 px-4 border-2 border-dashed border-gray-300 hover:border-quenza-primary/80 rounded-quenza-lg text-quenza-medium font-quenza-semibold text-gray-700 hover:text-quenza-secondary hover:bg-green-50/40 transition-all text-center"
                >
                    + Tambah Partner / Sponsor
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

            {/* Partner Item Cards */}
            {sponsors.map((sponsor, index) => (
                <div key={sponsor.id || index} id={sponsor.id} className="bg-white rounded-quenza-xl border border-gray-200 p-6 shadow-xs flex flex-col gap-5 transition-all">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <h4 className="text-quenza-medium font-quenza-bold text-gray-400 tracking-wider uppercase">
                            PARTNER {index + 1}
                        </h4>
                        <button
                            type="button"
                            onClick={() => handleRemoveSponsor(index)}
                            className="text-quenza-small font-quenza-semibold text-red-600 hover:text-red-800 transition-colors"
                        >
                            Hapus
                        </button>
                    </div>

                    {/* Content Layout */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Logo Preview & Upload */}
                        <div className="flex flex-col items-center gap-3 shrink-0 self-center md:self-start">
                            <div className="w-32 h-20 rounded-quenza-lg border border-gray-200 bg-gray-50 flex items-center justify-center p-2.5 overflow-hidden shadow-2xs">
                                {sponsor.logo ? (
                                    <img
                                        src={sanitizeUrl(sponsor.logo)}
                                        alt={sponsor.name || `Partner ${index + 1}`}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-quenza-small text-gray-400">Logo</span>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={(el) => (fileInputRefs.current[index] = el)}
                                onChange={(e) => handleLogoSelect(index, e)}
                                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRefs.current[index]?.click()}
                                className="quenza-btn-outline text-quenza-small font-quenza-medium px-4 py-1.5 rounded-quenza-md border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors inline-flex items-center gap-1.5"
                            >
                                Unggah Foto
                            </button>
                        </div>

                        {/* Form Inputs Grid */}
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Nama Partner/Sponsor */}
                            <div>
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Nama Partner/Sponsor <span className="text-quenza-danger font-bold ml-0.5">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={150}
                                    value={sponsor.name || ''}
                                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                    placeholder="Contoh: Telkom Indonesia"
                                    className="quenza-input"
                                    required
                                />
                            </div>

                            {/* Tier */}
                            <div>
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Tier <span className="text-quenza-danger font-bold ml-0.5">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={sponsor.tier || 'Platinum Sponsor'}
                                        onChange={(e) => handleFieldChange(index, 'tier', e.target.value)}
                                        className="quenza-input pr-10 appearance-none bg-white cursor-pointer"
                                        required
                                    >
                                        <option value="Platinum Sponsor">Platinum Sponsor</option>
                                        <option value="Gold Sponsor">Gold Sponsor</option>
                                        <option value="Silver Sponsor">Silver Sponsor</option>
                                        <option value="Media Partner">Media Partner</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Link company profile (Redirect Link) */}
                            <div className="sm:col-span-2">
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Link company profile
                                </label>
                                <input
                                    type="url"
                                    maxLength={500}
                                    value={sponsor.website_url || sponsor.redirect_link || ''}
                                    onChange={(e) => handleFieldChange(index, 'website_url', e.target.value)}
                                    placeholder="https://www.telkom.co.id/sites/profil-telkom..."
                                    className="quenza-input"
                                />
                            </div>

                            {/* Keterangan */}
                            <div className="sm:col-span-2">
                                <label className="block text-quenza-small font-quenza-medium text-quenza-text-secondary mb-1.5">
                                    Keterangan
                                </label>
                                <input
                                    type="text"
                                    maxLength={500}
                                    value={sponsor.description || sponsor.keterangan || ''}
                                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                    placeholder="Mendukung infrastruktur jaringan konferensi."
                                    className="quenza-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {sponsors.length === 0 && (
                <div className="bg-white rounded-quenza-xl border border-dashed border-gray-300 p-8 text-center text-quenza-text-secondary">
                    Belum ada partner atau sponsor yang ditambahkan. Klik tombol <strong className="text-gray-800">+ Tambah Partner / Sponsor</strong> di atas.
                </div>
            )}
        </div>
    );
}

import React, { useRef } from 'react';

export default function ImageSliderTab({ data, setData, errors, onSave, onPreview, processing, onUploadMedia, onRequestDelete, onNotify }) {
    const fileInputRefs = useRef({});

    const slides = Array.isArray(data.slider_images) ? data.slider_images : [];

    const handleAddSlide = () => {
        const newId = 'slide-' + Date.now();
        const newSlide = {
            id: newId,
            image: '',
            caption: '',
        };
        setData('slider_images', [...slides, newSlide]);
        if (onNotify) {
            onNotify('Slide banner baru berhasil ditambahkan!');
        }
        setTimeout(() => {
            const el = document.getElementById(newId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const handleRemoveSlide = (indexToRemove) => {
        const slideCaption = slides[indexToRemove]?.caption || `Slide ${indexToRemove + 1}`;
        if (onRequestDelete) {
            onRequestDelete({
                itemType: 'slider_images',
                index: indexToRemove,
                itemName: slideCaption,
                title: `Hapus Slide ${indexToRemove + 1}?`,
                message: `Slide banner "${slideCaption}" akan dihapus dari database landing page.`,
                onConfirm: () => {
                    const updated = slides.filter((_, idx) => idx !== indexToRemove);
                    setData('slider_images', updated);
                },
            });
        } else {
            const updated = slides.filter((_, idx) => idx !== indexToRemove);
            setData('slider_images', updated);
        }
    };

    const handleCaptionChange = (index, value) => {
        const updated = [...slides];
        updated[index] = { ...updated[index], caption: value };
        setData('slider_images', updated);
    };

    const handleFileSelect = async (index, event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Security / Client validation before upload
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format file tidak didukung. Silakan gunakan format JPG, PNG, WEBP, atau SVG.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 2MB.');
            return;
        }

        // Live preview immediately
        const objectUrl = URL.createObjectURL(file);
        const updatedWithLocal = [...slides];
        updatedWithLocal[index] = { ...updatedWithLocal[index], image: objectUrl };
        setData('slider_images', updatedWithLocal);

        // Upload to server
        if (onUploadMedia) {
            try {
                const uploadedUrl = await onUploadMedia(file, 'slider');
                if (uploadedUrl) {
                    const finalUpdated = [...slides];
                    finalUpdated[index] = { ...finalUpdated[index], image: uploadedUrl };
                    setData('slider_images', finalUpdated);
                }
            } catch (err) {
                console.error('Upload failed:', err);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Top Control Card */}
            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
                <p className="text-quenza-medium text-quenza-text-secondary">
                    Jumlah slide bebas — unggah/hapus gambar banner landing page.
                </p>

                {/* + Tambah Slide Button */}
                <button
                    type="button"
                    onClick={handleAddSlide}
                    className="w-full py-3.5 px-4 border-2 border-dashed border-gray-300 hover:border-quenza-primary/80 rounded-quenza-lg text-quenza-medium font-quenza-semibold text-gray-700 hover:text-quenza-secondary hover:bg-green-50/40 transition-all text-center"
                >
                    + Tambah Slide
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

            {/* Slide Item Cards */}
            {slides.map((slide, index) => (
                <div key={slide.id || index} id={slide.id} className="bg-white rounded-quenza-xl border border-gray-200 p-6 shadow-xs flex flex-col gap-4 transition-all">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <h4 className="text-quenza-medium font-quenza-semibold text-quenza-text-primary">
                            Slide {index + 1}
                        </h4>
                        <button
                            type="button"
                            onClick={() => handleRemoveSlide(index)}
                            className="text-quenza-small font-quenza-semibold text-quenza-danger hover:text-red-700 hover:underline transition-colors"
                        >
                            Hapus
                        </button>
                    </div>

                    {/* Content Row: Image + Input */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Thumbnail Preview */}
                        <div className="md:col-span-4 aspect-video sm:aspect-16/9 w-full bg-gray-100 rounded-quenza-lg overflow-hidden border border-gray-200 relative group">
                            {slide.image ? (
                                <img
                                    src={slide.image}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-quenza-small">Belum ada gambar</span>
                                </div>
                            )}
                        </div>

                        {/* Input & Upload Button */}
                        <div className="md:col-span-8 flex flex-col gap-4">
                            <div>
                                <label className="block text-quenza-medium font-quenza-medium text-quenza-text-secondary mb-2">
                                    Keterangan Slide <span className="text-quenza-danger font-bold ml-0.5">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={slide.caption || ''}
                                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                                    placeholder="Contoh: Keynote hall — hari pertama"
                                    className="quenza-input"
                                />
                            </div>

                            <div>
                                <input
                                    type="file"
                                    ref={(el) => (fileInputRefs.current[index] = el)}
                                    onChange={(e) => handleFileSelect(index, e)}
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRefs.current[index]?.click()}
                                    className="quenza-btn-outline text-quenza-small font-quenza-medium px-4 py-2 rounded-quenza-md border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors inline-flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Unggah Gambar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {slides.length === 0 && (
                <div className="bg-white rounded-quenza-xl border border-dashed border-gray-300 p-8 text-center text-quenza-text-secondary">
                    Belum ada slide banner yang ditambahkan. Klik tombol <strong className="text-gray-800">+ Tambah Slide</strong> di atas.
                </div>
            )}
        </div>
    );
}

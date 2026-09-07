import React, { useRef, useState } from 'react';
import { sanitizeUrl, sanitizeText, sanitizeFileName } from '../../Utils/sanitize';

export default function PaperRegistrationTab({ data, setData, errors, onSave, onPreview, processing, onUploadMedia, onNotify }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const paperReg = data.paper_registration || {
        presentation_type: 'Speech',
        paper_title: 'International Conference on Information Technology 2026',
        file_url: '',
        file_name: '',
    };

    const handleTypeChange = (type) => {
        const cleanType = type === 'Poster' ? 'Poster' : 'Speech';
        setData('paper_registration', {
            ...paperReg,
            presentation_type: cleanType,
        });
    };

    const handleTitleChange = (title) => {
        setData('paper_registration', {
            ...paperReg,
            paper_title: sanitizeText(title, 255),
        });
    };

    const processFile = async (file) => {
        if (!file) return;

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Format file harus berupa dokumen PDF (.pdf)!');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file naskah terlalu besar! Maksimal 10MB.');
            return;
        }

        const cleanFileName = sanitizeFileName(file.name);

        setUploading(true);
        try {
            if (onUploadMedia) {
                const uploadedUrl = await onUploadMedia(file, 'paper');
                if (uploadedUrl) {
                    setData('paper_registration', {
                        ...paperReg,
                        file_url: sanitizeUrl(uploadedUrl),
                        file_name: cleanFileName,
                    });
                    if (onNotify) {
                        onNotify(`Naskah "${cleanFileName}" berhasil diunggah!`);
                    }
                }
            } else {
                const localUrl = URL.createObjectURL(file);
                setData('paper_registration', {
                    ...paperReg,
                    file_url: localUrl,
                    file_name: cleanFileName,
                });
            }
        } catch (err) {
            console.error('Upload PDF failed:', err);
            if (onNotify) {
                onNotify('Gagal mengunggah naskah PDF. Silakan coba lagi.', 'error');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setData('paper_registration', {
            ...paperReg,
            file_url: '',
            file_name: '',
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onNotify) {
            onNotify('Naskah berhasil dihapus.');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Card 1: Jenis Presentasi */}
            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-4">
                <label className="block text-quenza-medium font-quenza-medium text-gray-700">
                    Jenis Presentasi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Speech Option */}
                    <button
                        type="button"
                        onClick={() => handleTypeChange('Speech')}
                        className={`w-full p-3.5 rounded-quenza-lg border transition-all flex items-center gap-3 cursor-pointer text-left ${
                            paperReg.presentation_type === 'Speech'
                                ? 'border-gray-400 bg-white shadow-2xs'
                                : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                paperReg.presentation_type === 'Speech'
                                    ? 'border-blue-600'
                                    : 'border-gray-400'
                            }`}
                        >
                            {paperReg.presentation_type === 'Speech' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                            )}
                        </div>
                        <span className="text-quenza-medium font-quenza-medium text-gray-800">
                            Speech
                        </span>
                    </button>

                    {/* Poster Option */}
                    <button
                        type="button"
                        onClick={() => handleTypeChange('Poster')}
                        className={`w-full p-3.5 rounded-quenza-lg border transition-all flex items-center gap-3 cursor-pointer text-left ${
                            paperReg.presentation_type === 'Poster'
                                ? 'border-gray-400 bg-white shadow-2xs'
                                : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                paperReg.presentation_type === 'Poster'
                                    ? 'border-blue-600'
                                    : 'border-gray-400'
                            }`}
                        >
                            {paperReg.presentation_type === 'Poster' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                            )}
                        </div>
                        <span className="text-quenza-medium font-quenza-medium text-gray-800">
                            Poster
                        </span>
                    </button>
                </div>
            </div>

            {/* Card 2: Judul Paper & Unggah Naskah (PDF) */}
            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
                {/* Judul Paper */}
                <div>
                    <label className="block text-quenza-medium font-quenza-medium text-gray-700 mb-2">
                        Judul paper
                    </label>
                    <input
                        type="text"
                        maxLength={255}
                        value={paperReg.paper_title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="International Conference on Information Technology 2026"
                        className="quenza-input"
                    />
                </div>

                {/* Unggah Naskah (PDF) */}
                <div>
                    <label className="block text-quenza-medium font-quenza-medium text-gray-700 mb-2">
                        Unggah naskah (PDF)
                    </label>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="application/pdf,.pdf"
                        className="hidden"
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-full border-2 border-dashed rounded-quenza-lg p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                            isDragging
                                ? 'border-quenza-secondary bg-green-50/50'
                                : 'border-gray-300 hover:border-gray-400 bg-white'
                        }`}
                    >
                        {uploading ? (
                            <div className="flex items-center gap-2 text-quenza-medium text-gray-600">
                                <svg className="animate-spin h-5 w-5 text-quenza-secondary" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Mengunggah dokumen PDF...</span>
                            </div>
                        ) : paperReg.file_url ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-quenza-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200 shadow-2xs">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-quenza-medium font-quenza-semibold text-gray-800 break-all">
                                        {paperReg.file_name || 'Naskah Paper (PDF)'}
                                    </p>
                                    <p className="text-quenza-small text-gray-500 mt-0.5">
                                        File naskah berhasil diunggah
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <a
                                        href={sanitizeUrl(paperReg.file_url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-quenza-small font-quenza-medium text-quenza-secondary hover:underline flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Lihat File
                                    </a>
                                    <span className="text-gray-300">•</span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="text-quenza-small font-quenza-medium text-red-600 hover:text-red-800 hover:underline"
                                    >
                                        Hapus File
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-quenza-medium text-gray-600">
                                Seret file naskah, atau klik untuk pilih
                            </p>
                        )}
                    </div>
                </div>

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
        </div>
    );
}

import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const formatSize = (kb) => {
    if (!kb) return '-';
    if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
    return kb + ' KB';
};

export default function UploadPaper({ paper }) {
    const { flash } = usePage().props;
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const MAX_SIZE_MB = 10;

    const validateFile = (f) => {
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(f.type) && !/\.(pdf|docx?|doc)$/i.test(f.name)) {
            return 'Format file harus PDF, DOC, atau DOCX.';
        }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
            return `Ukuran file maksimal ${MAX_SIZE_MB} MB.`;
        }
        return '';
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const err = validateFile(f);
        if (err) {
            setError(err);
            setFile(null);
            return;
        }
        setError('');
        setFile(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (!f) return;
        const err = validateFile(f);
        if (err) {
            setError(err);
            setFile(null);
            return;
        }
        setError('');
        setFile(f);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) {
            setError('Pilih file paper terlebih dahulu.');
            return;
        }
        setUploading(true);
        router.post(`/author/papers/${paper.id}/upload`, { paper_file: file }, {
            forceFormData: true,
            onSuccess: () => {
                setUploading(false);
            },
            onError: () => {
                setUploading(false);
            },
        });
    };

    return (
        <PublicLayout title="Upload File Paper" subtitle="Lampirkan file naskah paper Anda">
            <Head title="Upload Paper" />

            <div className="max-w-2xl mx-auto px-4 py-10">
                {flash?.success && (
                    <div className="mb-6 p-4 rounded-quenza-md bg-green-50 border border-green-300 text-green-800">
                        <p className="text-quenza-medium">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 p-4 rounded-quenza-md bg-red-50 border border-red-300 text-red-800">
                        <p className="text-quenza-medium">{flash.error}</p>
                    </div>
                )}

                {/* Info paper */}
                <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 mb-6">
                    <h2 className="font-quenza-bold text-gray-900 text-quenza-large">{paper.title}</h2>
                    <div className="flex gap-4 mt-2 text-quenza-small text-gray-500">
                        <span>Track: <strong className="text-gray-700">{paper.track || '-'}</strong></span>
                        <span>Status: <strong className="text-gray-700 capitalize">{paper.status}</strong></span>
                    </div>
                </div>

                {/* File saat ini */}
                {paper.file_name && (
                    <div className="bg-blue-50 border border-blue-200 rounded-quenza-xl p-4 mb-6 flex items-center gap-3">
                        <svg className="w-8 h-8 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                            <p className="text-quenza-medium font-quenza-semibold text-gray-900 truncate">{paper.file_name}</p>
                            <p className="text-quenza-small text-gray-500">{formatSize(paper.file_size)}</p>
                        </div>
                        <a
                            href={`/author/papers/${paper.id}/download`}
                            className="shrink-0 px-4 py-2 rounded-quenza-md border border-blue-300 text-blue-700 text-quenza-small font-quenza-semibold hover:bg-blue-100 transition-colors"
                        >
                            Unduh
                        </a>
                    </div>
                )}

                {/* Form upload */}
                <form onSubmit={handleUpload} className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                    <label className="block text-quenza-medium font-quenza-semibold text-gray-700 mb-3">
                        {paper.file_name ? 'Ganti File Paper' : 'Pilih File Paper'} <span className="text-red-600">*</span>
                    </label>

                    {/* Dropzone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-quenza-lg p-8 text-center transition-colors cursor-pointer ${
                            dragOver ? 'border-quenza-secondary bg-green-50' : 'border-gray-300 hover:border-quenza-primary hover:bg-gray-50'
                        }`}
                        onClick={() => document.getElementById('paper-file-input')?.click()}
                    >
                        <input
                            id="paper-file-input"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {file ? (
                            <div>
                                <p className="text-quenza-medium font-quenza-semibold text-gray-900">{file.name}</p>
                                <p className="text-quenza-small text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB — klik untuk ganti</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-quenza-medium text-gray-700">
                                    Tarik & lepas file di sini, atau <span className="text-quenza-secondary font-quenza-semibold">klik untuk memilih</span>
                                </p>
                                <p className="text-quenza-small text-gray-500 mt-1">PDF, DOC, atau DOCX — maksimal {MAX_SIZE_MB} MB</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-600 text-quenza-small mt-3">{error}</p>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="flex-1 px-6 py-3 rounded-quenza-lg bg-quenza-secondary text-white font-quenza-semibold hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Mengupload...' : 'Upload File Paper'}
                        </button>
                        <Link
                            href={`/author/papers/${paper.id}`}
                            className="px-6 py-3 rounded-quenza-lg border border-gray-300 text-gray-700 font-quenza-medium hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </form>

                <p className="text-quenza-small text-gray-500 mt-4 text-center">
                    File naskah hanya dapat dilihat oleh Anda dan tim review konferensi.
                </p>
            </div>
        </PublicLayout>
    );
}

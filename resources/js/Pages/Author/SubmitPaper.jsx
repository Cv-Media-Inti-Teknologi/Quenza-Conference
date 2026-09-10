import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const TRACKS = [
    { value: '', label: 'Pilih Track' },
    { value: 'AI & Data Science', label: 'AI & Data Science' },
    { value: 'Pendidikan Digital', label: 'Pendidikan Digital' },
    { value: 'Kesehatan Masyarakat', label: 'Kesehatan Masyarakat' },
    { value: 'Ekonomi Digital', label: 'Ekonomi Digital' },
    { value: 'Teknologi Informasi', label: 'Teknologi Informasi' },
    { value: 'Kecerdasan Buatan', label: 'Kecerdasan Buatan' },
    { value: 'Sistem Terdistribusi', label: 'Sistem Terdistribusi' },
];

export default function SubmitPaper({ errors = {}, notVerified = false }) {
    const { data, setData, post, processing, reset, wasSuccessful } = useForm({
        title: '',
        abstract: '',
        full_text: '',
        track: '',
        submitted_at: new Date().toISOString().split('T')[0],
        paper_file: null,
    });

    const { flash } = usePage().props;

    const [showPreview, setShowPreview] = useState(false);
    const [fileError, setFileError] = useState('');

    const handleFileChange = (e) => {
        const f = e.target.files?.[0] || null;
        if (!f) {
            setData('paper_file', null);
            return;
        }
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(f.type) && !/\.(pdf|docx?|doc)$/i.test(f.name)) {
            setFileError('Format file harus PDF, DOC, atau DOCX.');
            e.target.value = '';
            return;
        }
        if (f.size > 10 * 1024 * 1024) {
            setFileError('Ukuran file maksimal 10 MB.');
            e.target.value = '';
            return;
        }
        setFileError('');
        setData('paper_file', f);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/author/papers', {
            onSuccess: (page) => {
                reset();
                setShowPreview(false);
            },
        });
    };

    return (
        <PublicLayout title="Submit Paper" subtitle="Unggah naskah paper Anda untuk proses review">
            <Head title="Submit Paper" />

            <div className="max-w-4xl mx-auto px-4 py-10">
                {notVerified && (
                    <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-quenza-xl p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-yellow-100 border-2 border-yellow-300 text-yellow-600 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-quenza-bold text-gray-900 mb-2">Akun Belum Terverifikasi</h2>
                        <p className="text-quenza-medium text-gray-600 mb-4">
                            Sebelum mengirim paper, Anda perlu menyelesaikan pembayaran registrasi konferensi.
                            Setelah pembayaran dikonfirmasi, akun Anda otomatis terverifikasi dan form submit akan aktif.
                        </p>
                        <Link
                            href="/payment"
                            className="inline-block px-6 py-3 rounded-quenza-lg bg-quenza-secondary text-white font-quenza-semibold hover:brightness-105 transition-all"
                        >
                            Selesaikan Pembayaran Sekarang
                        </Link>
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-2xl font-quenza-bold text-gray-900 mb-2">Submit Paper</h1>
                    <p className="text-quenza-medium text-gray-600">
                        Unggah naskah paper Anda. Pastikan paper Anda memenuhi format dan panduan yang berlaku.
                    </p>
                </div>

                <div className={`bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 ${notVerified ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-quenza-medium font-quenza-semibold text-gray-700 mb-2">
                                Judul Paper <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Masukkan judul paper Anda"
                                className="w-full quenza-input px-4 py-3 text-quenza-medium border-gray-300 rounded-quenza-lg focus:border-quenza-primary focus:ring-quenza-primary"
                                required
                            />
                            {errors.title && (
                                <p className="text-red-600 text-quenza-small mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Track */}
                        <div>
                            <label className="block text-quenza-medium font-quenza-semibold text-gray-700 mb-2">
                                Track / Bidang <span className="text-red-600">*</span>
                            </label>
                            <select
                                name="track"
                                value={data.track}
                                onChange={(e) => setData('track', e.target.value)}
                                className="w-full quenza-input px-4 py-3 text-quenza-medium border-gray-300 rounded-quenza-lg focus:border-quenza-primary focus:ring-quenza-primary"
                                required
                            >
                                {TRACKS.map((track) => (
                                    <option key={track.value} value={track.value}>
                                        {track.label}
                                    </option>
                                ))}
                            </select>
                            {errors.track && (
                                <p className="text-red-600 text-quenza-small mt-1">{errors.track}</p>
                            )}
                        </div>

                        {/* Abstract */}
                        <div>
                            <label className="block text-quenza-medium font-quenza-semibold text-gray-700 mb-2">
                                Abstract <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                name="abstract"
                                value={data.abstract}
                                onChange={(e) => setData('abstract', e.target.value)}
                                placeholder="Tulis abstrak paper Anda (min. 100 kata)"
                                rows={8}
                                className="w-full quenza-input px-4 py-3 text-quenza-medium border-gray-300 rounded-quenza-lg focus:border-quenza-primary focus:ring-quenza-primary resize-vertical"
                                required
                                minLength={100}
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-quenza-small text-gray-500">Min. 100 karakter</p>
                                <p className="text-quenza-small text-gray-500">{data.abstract.length} karakter</p>
                            </div>
                            {errors.abstract && (
                                <p className="text-red-600 text-quenza-small mt-1">{errors.abstract}</p>
                            )}
                        </div>

                        {/* Full Text */}
                        <div>
                            <label className="block text-quenza-medium font-quenza-semibold text-gray-700 mb-2">
                                Full Paper {data.paper_file ? <span className="text-gray-400 text-quenza-small">(opsional jika file dilampirkan)</span> : <span className="text-red-600">*</span>}
                            </label>
                            <textarea
                                name="full_text"
                                value={data.full_text}
                                onChange={(e) => setData('full_text', e.target.value)}
                                placeholder="Tulis naskah lengkap paper Anda (min. 1000 karakter), atau lampirkan file PDF/DOC di bawah"
                                rows={15}
                                className="w-full quenza-input px-4 py-3 text-quenza-medium border-gray-300 rounded-quenza-lg focus:border-quenza-primary focus:ring-quenza-primary resize-vertical font-mono text-sm"
                                required={!data.paper_file}
                                minLength={data.paper_file ? undefined : 1000}
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-quenza-small text-gray-500">Min. 1000 karakter — atau lampirkan file di bawah</p>
                                <p className="text-quenza-small text-gray-500">{data.full_text.length} karakter</p>
                            </div>
                            {errors.full_text && (
                                <p className="text-red-600 text-quenza-small mt-1">{errors.full_text}</p>
                            )}
                        </div>

                        {/* File Upload (opsional) */}
                        <div>
                            <label className="block text-quenza-medium font-quenza-semibold text-gray-700 mb-2">
                                File Paper <span className="text-gray-400 text-quenza-small">(opsional — PDF/DOC/DOCX, maks. 10 MB)</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    name="paper_file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileChange}
                                    className="flex-1 quenza-input px-4 py-2.5 text-quenza-small border-gray-300 rounded-quenza-lg file:mr-3 file:px-3 file:py-1.5 file:rounded-quenza-md file:border-0 file:bg-quenza-secondary file:text-white file:text-quenza-small file:font-quenza-semibold file:cursor-pointer"
                                />
                                {data.paper_file && (
                                    <button
                                        type="button"
                                        onClick={() => setData('paper_file', null)}
                                        className="px-3 py-2 rounded-quenza-md border border-gray-300 text-gray-600 text-quenza-small hover:bg-gray-50 transition-colors"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                            {fileError && (
                                <p className="text-red-600 text-quenza-small mt-1">{fileError}</p>
                            )}
                            {errors.paper_file && (
                                <p className="text-red-600 text-quenza-small mt-1">{errors.paper_file}</p>
                            )}
                        </div>

                        {/* Hidden field for submitted_at */}
                        <input type="hidden" name="submitted_at" value={new Date().toISOString()} />

                        {/* Error General */}
                        {errors._token && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-quenza-md">
                                {errors._token}
                            </div>
                        )}

                        {/* Error global dari backend (mis. belum verifikasi) */}
                        {(errors.error || flash?.error) && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-quenza-md">
                                {errors.error || flash.error}
                            </div>
                        )}

                        {/* Pesan sukses setelah submit berhasil */}
                        {wasSuccessful && (
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-quenza-md">
                                Paper berhasil disubmit! Anda akan diarahkan ke daftar paper Anda...
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="px-6 py-3 rounded-quenza-lg border border-gray-300 text-quenza-medium font-quenza-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 rounded-quenza-lg bg-quenza-primary text-white font-quenza-semibold hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Mengupload...
                                    </span>
                                ) : (
                                    'Submit Paper'
                                )}
                            </button>

                            <Link
                                href="/author/papers"
                                className="px-6 py-3 rounded-quenza-lg border border-gray-300 text-quenza-medium font-quenza-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Preview Section */}
                {showPreview && (
                    <div className="bg-white rounded-quenza-xl border border-gray-200 p-6 sm:p-8 mt-8">
                        <h2 className="text-xl font-quenza-bold text-gray-900 mb-4">Preview Paper</h2>
                        <div className="prose prose-sm max-w-none text-gray-700">
                            <h3 className="text-lg font-quenza-semibold text-gray-900 mb-2">Judul</h3>
                            <p className="text-gray-700 mb-6">{data.title || 'Belum ada judul'}</p>

                            <h3 className="text-lg font-quenza-semibold text-gray-900 mb-2">Track</h3>
                            <p className="text-gray-700 mb-6">{data.track || 'Belum dipilih'}</p>

                            <h3 className="text-lg font-quenza-semibold text-gray-900 mb-2">Abstract</h3>
                            <p className="text-gray-700 whitespace-pre-wrap mb-6">{data.abstract || 'Belum ada abstract'}</p>

                            <h3 className="text-lg font-quenza-semibold text-gray-900 mb-2">Full Paper</h3>
                            <div className="bg-gray-50 rounded-quenza-lg p-4 max-h-96 overflow-y-auto text-sm text-gray-600 whitespace-pre-wrap">
                                {data.full_text || 'Belum ada full paper'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

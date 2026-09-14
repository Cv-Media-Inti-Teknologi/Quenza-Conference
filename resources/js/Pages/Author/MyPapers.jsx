import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function MyPapers({ papers = [], loading = false, notVerified = false, flash = {} }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const statusLabels = {
        submitted: 'Submitted',
        under_review: 'Under Review',
        revision_required: 'Revision Required',
        accepted: 'Accepted',
        rejected: 'Rejected',
    };

    const statusColors = {
        submitted: 'bg-blue-100 text-blue-800',
        under_review: 'bg-yellow-100 text-yellow-800',
        revision_required: 'bg-orange-100 text-orange-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    const filteredPapers = papers.filter((paper) => {
        const matchesSearch = search === '' ||
            paper.title.toLowerCase().includes(search.toLowerCase()) ||
            paper.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || paper.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <PublicLayout title="My Papers" subtitle="Pantau paper yang sudah Anda submit">
            <Head title="My Papers" />

            <div className="max-w-5xl mx-auto px-4 py-10">
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

                {notVerified && (
                    <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-quenza-xl p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 border-2 border-yellow-300 text-yellow-600 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="font-quenza-bold text-gray-900">Akun Anda belum terverifikasi</h2>
                                <p className="text-quenza-medium text-gray-600 mt-1">
                                    Selesaikan pembayaran registrasi untuk mengaktifkan fitur submit paper.
                                </p>
                            </div>
                            <Link
                                href="/payment"
                                className="shrink-0 px-5 py-2.5 rounded-quenza-lg bg-quenza-secondary text-white text-quenza-medium font-quenza-semibold hover:brightness-105 transition-all"
                            >
                                Bayar Sekarang
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-quenza-bold text-gray-900 mb-1">My Papers</h1>
                        <p className="text-quenza-medium text-gray-600">
                            Paper yang sudah Anda submit dan status review-nya
                        </p>
                    </div>
                    <Link
                        href={notVerified ? '/payment' : '/author/papers/submit'}
                        className="px-6 py-3 rounded-quenza-lg bg-quenza-primary text-white font-quenza-semibold hover:brightness-105 transition-all"
                    >
                        <svg className="w-5 h-5 inline mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {notVerified ? 'Bayar untuk Submit Paper' : 'Submit Paper Baru'}
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-quenza-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari judul paper..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 quenza-input px-4 py-3 text-quenza-medium"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="quenza-input px-4 py-3 text-quenza-medium w-full sm:w-48"
                    >
                        <option value="all">Semua Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="revision_required">Revision Required</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Papers List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 animate-spin text-quenza-primary" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p>Memuat paper...</p>
                    </div>
                ) : filteredPapers.length === 0 ? (
                    <div className="bg-white rounded-quenza-xl border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-quenza-semibold text-gray-900 mb-2">
                            {search || statusFilter !== 'all' ? 'Tidak ada paper yang ditemukan' : 'Belum ada paper yang disubmit'}
                        </h3>
                        <p className="text-quenza-medium text-gray-600 mb-4">
                            {search || statusFilter !== 'all'
                                ? 'Coba ubah filter atau kata kunci pencarian'
                                : 'Submit paper pertama Anda untuk memulai proses review'}
                        </p>
                        {!search && statusFilter === 'all' && (
                            <Link
                                href="/author/papers/submit"
                                className="inline-block px-6 py-3 rounded-quenza-lg bg-quenza-primary text-white font-quenza-semibold hover:brightness-105 transition-all"
                            >
                                Submit Paper Baru
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPapers.map((paper) => (
                            <div
                                key={paper.id}
                                className="bg-white rounded-quenza-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 rounded-full text-quenza-small font-quenza-semibold bg-gray-100 text-gray-700">
                                                {paper.id}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-quenza-small font-quenza-semibold ${statusColors[paper.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {statusLabels[paper.status] || paper.status}
                                            </span>
                                        </div>
                                        <h3 className="text-quenza-medium font-quenza-semibold text-gray-900 mb-1 line-clamp-2">
                                            {paper.title}
                                        </h3>
                                        <p className="text-quenza-small text-gray-500">
                                            Track: {paper.track || '-'} | Dikirim: {paper.submitted_atFormatted || '-'}
                                            {paper.file_name && (
                                                <span className="text-quenza-secondary font-quenza-medium"> | 📄 {paper.file_name}</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-quenza-small text-gray-500">
                                            Similarity: {paper.similarity_score !== null ? `${paper.similarity_score}%` : 'Sedang diproses'}
                                        </span>
                                        <Link
                                            href={`/author/papers/${paper.id}`}
                                            className="px-4 py-2 rounded-quenza-md bg-gray-100 text-gray-700 text-quenza-medium font-quenza-medium hover:bg-gray-200 transition-colors"
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

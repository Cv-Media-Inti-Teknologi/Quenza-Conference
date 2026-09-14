import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function PaperDetail({ paper, errors = {} }) {
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

    const statusDescriptions = {
        submitted: 'Paper Anda sudah diterima dan menunggu penugasan reviewer.',
        under_review: 'Paper Anda sedang dalam proses review oleh reviewer.',
        revision_required: 'Paper Anda perlu direvisi sesuai masukan reviewer.',
        accepted: 'Selamat! Paper Anda diterima untuk dipresentasikan.',
        rejected: 'Maaf, paper Anda tidak lolos proses review.',
    };

    if (!paper) return null;

    return (
        <PublicLayout title={`Paper Detail — ${paper.title}`} subtitle="Detail paper dan progress review">
            <Head title="Paper Detail" />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link
                            href="/author/papers"
                            className="text-quenza-medium text-gray-600 hover:text-quenza-primary mb-2 inline-block"
                        >
                            ← Kembali ke My Papers
                        </Link>
                        <h1 className="text-xl font-quenza-bold text-gray-900">{paper.title}</h1>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-quenza-small font-quenza-semibold ${statusColors[paper.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[paper.status] || paper.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Info Card */}
                        <div className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                            <h2 className="text-quenza-medium font-quenza-semibold text-gray-900 mb-4">Informasi Paper</h2>
                            <dl className="grid grid-cols-2 gap-4 text-quenza-medium">
                                <div>
                                    <dt className="text-quenza-small text-gray-500">Paper ID</dt>
                                    <dd className="font-quenza-semibold text-gray-900">{paper.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-quenza-small text-gray-500">Track</dt>
                                    <dd className="font-quenza-semibold text-gray-900">{paper.track || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-quenza-small text-gray-500">Dikirim</dt>
                                    <dd className="font-quenza-semibold text-gray-900">{paper.submitted_at || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-quenza-small text-gray-500">Similarity Score</dt>
                                    <dd className="font-quenza-semibold text-gray-900">
                                        {paper.similarity_score !== null ? `${paper.similarity_score}%` : 'Sedang diproses'}
                                    </dd>
                                </div>
                            </dl>

                            {/* File Paper */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <dt className="text-quenza-small text-gray-500 mb-2">File Naskah</dt>
                                {paper.file_url ? (
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-quenza-medium font-quenza-semibold text-gray-900 truncate">{paper.file_name}</p>
                                            <p className="text-quenza-small text-gray-500">{paper.file_size ? paper.file_size + ' KB' : ''}</p>
                                        </div>
                                        <a
                                            href={paper.file_url}
                                            className="shrink-0 px-4 py-2 rounded-quenza-md bg-quenza-primary text-gray-900 text-quenza-small font-quenza-semibold hover:brightness-105 transition-all"
                                        >
                                            Unduh
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <p className="flex-1 text-quenza-small text-gray-500">Belum ada file yang dilampirkan.</p>
                                        <Link
                                            href={`/author/papers/${paper.id}/upload`}
                                            className="shrink-0 px-4 py-2 rounded-quenza-md border border-gray-300 text-gray-700 text-quenza-small font-quenza-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Upload File
                                        </Link>
                                    </div>
                                )}
                                {paper.file_url && (
                                    <Link
                                        href={`/author/papers/${paper.id}/upload`}
                                        className="inline-block mt-3 text-quenza-small text-quenza-secondary font-quenza-medium hover:underline"
                                    >
                                        Ganti file
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                            <h2 className="text-quenza-medium font-quenza-semibold text-gray-900 mb-3">Status & Progress</h2>
                            <div className={`p-4 rounded-quenza-lg border ${
                                paper.status === 'accepted' ? 'bg-green-50 border-green-200' :
                                paper.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                paper.status === 'revision_required' ? 'bg-orange-50 border-orange-200' :
                                'bg-blue-50 border-blue-200'
                            }`}>
                                <p className="text-quenza-medium text-gray-900 mb-2">{statusLabels[paper.status] || paper.status}</p>
                                <p className="text-quenza-small text-gray-600">{statusDescriptions[paper.status] || ''}</p>
                            </div>
                        </div>

                        {/* Abstract */}
                        <div className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                            <h2 className="text-quenza-medium font-quenza-semibold text-gray-900 mb-3">Abstract</h2>
                            <p className="text-quenza-medium text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {paper.abstract || '-'}
                            </p>
                        </div>

                        {/* Full Paper */}
                        <div className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                            <h2 className="text-quenza-medium font-quenza-semibold text-gray-900 mb-3">Full Paper</h2>
                            <div className="bg-gray-50 rounded-quenza-lg p-4 max-h-96 overflow-y-auto text-sm text-gray-600 whitespace-pre-wrap font-mono">
                                {paper.full_text || '-'}
                            </div>
                        </div>

                        {/* Reviews */}
                        {paper.reviews && paper.reviews.length > 0 && (
                            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                                <h2 className="text-quenza-medium font-quenza-semibold text-gray-900 mb-4">Review & Feedback</h2>
                                <div className="space-y-4">
                                    {paper.reviews.map((review) => (
                                        <div key={review.id} className="border border-gray-200 rounded-quenza-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-quenza-semibold text-gray-900">{review.reviewer_name}</p>
                                                    <p className="text-quenza-small text-gray-500">
                                                        Score: {review.score} | Status: {review.status}
                                                    </p>
                                                </div>
                                                {review.decision && (
                                                    <span className={`px-3 py-1 rounded-full text-quenza-small font-quenza-semibold ${
                                                        review.decision === 'approve' ? 'bg-green-100 text-green-800' :
                                                        review.decision === 'revision' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {review.decision}
                                                    </span>
                                                )}
                                            </div>
                                            {review.comment && (
                                                <p className="text-quenza-medium text-gray-700 whitespace-pre-wrap">
                                                    {review.comment}
                                                </p>
                                            )}
                                            {review.submitted_at && (
                                                <p className="text-quenza-small text-gray-400 mt-2">
                                                    Disubmit: {review.submitted_at}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {paper.reviews && paper.reviews.length === 0 && (
                            <div className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                                <p className="text-quenza-medium text-gray-600">
                                    Belum ada review untuk paper ini. Tunggu beberapa saat hingga reviewer ditugaskan.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-quenza-xl border border-gray-200 p-6">
                            <h2 className="text-quenza-medium font-quenza-semibold text-gray-900 mb-4">Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.post(`/author/papers/${paper.id.replace('P-', '')}/withdraw`)}
                                    className="w-full px-4 py-3 rounded-quenza-md border border-red-200 text-red-600 text-quenza-medium font-quenza-medium hover:bg-red-50 transition-colors"
                                >
                                    Withdraw Paper
                                </button>
                                <button
                                    onClick={() => router.post(`/author/papers/${paper.id.replace('P-', '')}/resubmit`)}
                                    className="w-full px-4 py-3 rounded-quenza-md border border-gray-300 text-gray-700 text-quenza-medium font-quenza-medium hover:bg-gray-50 transition-colors"
                                    disabled={paper.status !== 'revision_required'}
                                >
                                    Revise & Resubmit
                                </button>
                            </div>
                        </div>

                        <div className="bg-quenza-sidebar text-white p-6 rounded-quenza-xl">
                            <h2 className="text-quenza-medium font-quenza-semibold mb-3">Tips untuk Author</h2>
                            <ul className="text-quenza-small text-green-100 space-y-2">
                                <li>• Pastikan paper Anda mematuhi format template</li>
                                <li>• Abstract harus jelas dan menjelaskan kontribusi</li>
                                <li>• Similarity score di bawah 30% disarankan</li>
                                <li>• Responsif terhadap masukan reviewer</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

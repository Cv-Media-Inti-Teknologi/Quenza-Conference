import React, { useState, useEffect } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchReviews();
    }, [search, statusFilter]);

    const fetchReviews = () => {
        setLoading(true);
        const params = new URLSearchParams({
            search,
            status: statusFilter === 'all' ? '' : statusFilter,
        });
        fetch(`/reviewer/api/reviews?${params}`)
            .then(r => r.json())
            .then(d => {
                setReviews(d.data || []);
                setLoading(false);
            })
            .catch(() => {
                setReviews([]);
                setLoading(false);
            });
    };

    const getSimilarityColor = (score) => {
        if (score <= 10) return 'bg-green-50 text-green-700';
        if (score <= 30) return 'bg-orange-50 text-orange-700';
        return 'bg-red-50 text-red-700';
    };

    const getStatusBadge = (status) => {
        if (status === 'pending') {
            return 'bg-blue-50 text-blue-700';
        }
        return 'bg-green-50 text-green-700';
    };

    const getActionLabel = (status) => {
        return status === 'pending' ? 'Review' : 'View';
    };

    return (
        <AdminLayout title="Review Paper" subtitle="Daftar paper yang ditugaskan untuk direview">
            <Head title="Review Paper" />

            <div className="space-y-6">
                {/* Filters Section */}
                <div className="quenza-card">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="quenza-input"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Search Input */}
                        <div>
                            <label className="block text-quenza-small font-quenza-medium text-quenza-text-primary mb-2">
                                Pencarian
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul atau ID paper"
                                className="quenza-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="quenza-card">
                    <div className="mb-6">
                        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Daftar Paper</h3>
                        <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-1">
                            {reviews.length} paper ditugaskan
                        </p>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="inline-block">
                                <svg className="animate-spin h-8 w-8 text-quenza-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <p className="text-quenza-medium font-quenza-regular text-quenza-text-secondary mt-3">Loading...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-quenza-small">
                                <thead>
                                    <tr className="border-b border-quenza-border bg-gray-50">
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">ID</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">JUDUL</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">TRACK</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">SIMILARITY</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">STATUS</th>
                                        <th className="px-4 py-3 text-center font-quenza-semibold text-quenza-text-primary">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review, index) => (
                                        <tr key={index} className="border-b border-quenza-border hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-quenza-semibold text-quenza-text-primary">P-{String(review.paper_id).padStart(3, '0')}</td>
                                            <td className="px-4 py-3 font-quenza-medium max-w-xs truncate text-quenza-text-primary">{review.title}</td>
                                            <td className="px-4 py-3 text-quenza-text-secondary font-quenza-regular">{review.track}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-quenza-small font-quenza-semibold ${getSimilarityColor(review.similarity_score)}`}>
                                                    {review.similarity_score}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`quenza-badge ${getStatusBadge(review.status)}`}>
                                                    {review.status === 'pending' ? 'Pending' : 'Completed'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <a
                                                    href={`/reviewer/review/${review.paper_id}`}
                                                    className="quenza-btn-primary text-quenza-small px-3 py-1.5"
                                                >
                                                    {getActionLabel(review.status)}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <svg className="w-12 h-12 mx-auto text-quenza-text-secondary/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p className="text-quenza-medium font-quenza-regular text-quenza-text-secondary">Tidak ada paper untuk direview</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

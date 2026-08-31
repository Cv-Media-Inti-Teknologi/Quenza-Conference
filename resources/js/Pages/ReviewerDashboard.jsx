import React from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function ReviewerDashboard({ pending_count, completed_count, total_assigned, recent_papers }) {
    return (
        <AdminLayout title="Dashboard Reviewer" subtitle="Kelola review paper yang ditugaskan">
            <Head title="Dashboard Reviewer" />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pending Reviews */}
                    <div className="quenza-card quenza-card-hover">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <svg className="w-10 h-10 text-quenza-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary">Pending Reviews</p>
                                <p className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary">{pending_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* Completed Reviews */}
                    <div className="quenza-card quenza-card-hover">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <svg className="w-10 h-10 text-quenza-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary">Completed Reviews</p>
                                <p className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary">{completed_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Assigned */}
                    <div className="quenza-card quenza-card-hover">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <svg className="w-10 h-10 text-quenza-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary">Total Assigned</p>
                                <p className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary">{total_assigned}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Papers to Review */}
                <div className="quenza-card">
                    <div className="mb-6">
                        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Recent Papers to Review</h3>
                        <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-1">Papers assigned to you</p>
                    </div>

                    {recent_papers && recent_papers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-quenza-small">
                                <thead>
                                    <tr className="border-b border-quenza-border bg-gray-50">
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">Paper ID</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">Title</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">Track</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">Similarity Score</th>
                                        <th className="px-4 py-3 text-left font-quenza-semibold text-quenza-text-primary">Assigned Date</th>
                                        <th className="px-4 py-3 text-center font-quenza-semibold text-quenza-text-primary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_papers.map((paper, index) => (
                                        <tr key={index} className="border-b border-quenza-border hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-quenza-text-primary font-quenza-medium">{paper.paper_id}</td>
                                            <td className="px-4 py-3 text-quenza-text-primary font-quenza-regular max-w-xs truncate">{paper.title}</td>
                                            <td className="px-4 py-3 text-quenza-text-secondary font-quenza-regular">{paper.track}</td>
                                            <td className="px-4 py-3">
                                                <span className="quenza-badge-success">{(paper.similarity_score || 0).toFixed(1)}%</span>
                                            </td>
                                            <td className="px-4 py-3 text-quenza-text-secondary font-quenza-regular">{paper.assigned_date}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Link
                                                    href={`/reviewer/review/${paper.paper_id}`}
                                                    className="quenza-btn-primary text-quenza-small px-3 py-1.5"
                                                >
                                                    Review
                                                </Link>
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
                            <p className="text-quenza-medium font-quenza-regular text-quenza-text-secondary">No papers awaiting review</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

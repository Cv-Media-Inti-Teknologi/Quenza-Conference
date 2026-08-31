import React, { useState, useEffect } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import ReviewForm from '../Components/ReviewForm';
import { Head } from '@inertiajs/react';

export default function ReviewDetail({ paperId }) {
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!paperId) return;
        
        fetch(`/reviewer/api/review/${paperId}`)
            .then(r => {
                if (!r.ok) throw new Error('Paper not found');
                return r.json();
            })
            .then(d => {
                setPaper(d);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [paperId]);

    if (loading) return (
        <AdminLayout title="Review Paper" subtitle="Nilai dan berikan feedback untuk paper">
            <div className="text-center py-8 text-quenza-text-secondary">Loading paper...</div>
        </AdminLayout>
    );

    if (error || !paper) return (
        <AdminLayout title="Review Paper" subtitle="Nilai dan berikan feedback untuk paper">
            <div className="text-center py-8 text-quenza-danger">
                {error || 'Paper not found or you don\'t have access'}
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="Review Paper" subtitle="Nilai dan berikan feedback untuk paper">
            <Head title="Review Paper" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="quenza-card rounded-quenza-xl p-6">
                        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">
                            Detail Paper
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1">
                                    ID
                                </p>
                                <p className="text-quenza-medium font-quenza-medium text-quenza-text-primary">
                                    {paper.paper_id}
                                </p>
                            </div>

                            <div>
                                <p className="text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1">
                                    Track
                                </p>
                                <p className="text-quenza-medium font-quenza-medium text-quenza-text-primary">
                                    {paper.track}
                                </p>
                            </div>

                            <div>
                                <p className="text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1">
                                    Similarity Score
                                </p>
                                <div className={`inline-block px-3 py-1 rounded-quenza-md text-quenza-small font-quenza-semibold ${
                                    paper.similarity_score <= 10 ? 'bg-green-100 text-green-700' :
                                    paper.similarity_score <= 30 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {paper.similarity_score}%
                                </div>
                            </div>

                            <div>
                                <p className="text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1">
                                    Author
                                </p>
                                <p className="text-quenza-medium font-quenza-medium text-quenza-text-primary">
                                    {paper.author.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="quenza-card rounded-quenza-xl p-6">
                        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-3">
                            {paper.title}
                        </h3>
                        <div>
                            <p className="text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">
                                Abstract
                            </p>
                            <p className="text-quenza-medium text-quenza-text-primary leading-relaxed">
                                {paper.abstract}
                            </p>
                        </div>
                    </div>

                    <ReviewForm paper={paper} currentReview={paper.current_review} />
                </div>
            </div>
        </AdminLayout>
    );
}

import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ReviewForm({ paper, currentReview }) {
    const [formData, setFormData] = useState({
        score: currentReview?.score || '',
        comment: currentReview?.comment || '',
        decision: currentReview?.decision || '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const newErrors = {};
        if (!formData.score || formData.score < 1 || formData.score > 10) {
            newErrors.score = 'Score harus antara 1-10';
        }
        if (!formData.comment || formData.comment.length < 10) {
            newErrors.comment = 'Komentar minimal 10 karakter';
        }
        if (!formData.decision) {
            newErrors.decision = 'Pilih keputusan review';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const paperId = paper.paper_id.replace('P-', '');
            const response = await fetch(`/reviewer/api/review/${paperId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.visit('/reviewer/dashboard');
                }, 1500);
            } else {
                const data = await response.json();
                setErrors(data.errors || { form: 'Gagal submit review' });
            }
        } catch (error) {
            setErrors({ form: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="quenza-card rounded-quenza-xl p-6 bg-green-50 border border-green-200">
                <p className="text-green-700 font-quenza-semibold">✓ Review berhasil disubmit! Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="quenza-card rounded-quenza-xl p-6">
            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-6">
                Berikan Review
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">
                        Score (1-10)
                    </label>
                    <input
                        type="number"
                        name="score"
                        min="1"
                        max="10"
                        value={formData.score}
                        onChange={handleChange}
                        className="quenza-input w-full"
                        placeholder="Berikan skor 1-10"
                    />
                    {errors.score && <p className="text-quenza-danger text-quenza-small mt-1">{errors.score}</p>}
                </div>

                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">
                        Komentar & Feedback
                    </label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="quenza-input w-full h-24 resize-none"
                        placeholder="Berikan feedback detail untuk author (minimal 10 karakter)..."
                    />
                    {errors.comment && <p className="text-quenza-danger text-quenza-small mt-1">{errors.comment}</p>}
                </div>

                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">
                        Keputusan
                    </label>
                    <select
                        name="decision"
                        value={formData.decision}
                        onChange={handleChange}
                        className="quenza-input w-full"
                    >
                        <option value="">-- Pilih Keputusan --</option>
                        <option value="approve">Setujui (Approve)</option>
                        <option value="revision">Minta Revisi (Revision)</option>
                        <option value="reject">Tolak (Reject)</option>
                    </select>
                    {errors.decision && <p className="text-quenza-danger text-quenza-small mt-1">{errors.decision}</p>}
                </div>

                {errors.form && (
                    <div className="bg-red-50 border border-red-200 rounded-quenza-lg p-3">
                        <p className="text-quenza-danger text-quenza-small">{errors.form}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="quenza-btn-outline text-quenza-small font-quenza-medium px-4 py-2 rounded-quenza-md"
                    >
                        Batalkan
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2 rounded-quenza-md disabled:opacity-50"
                    >
                        {loading ? 'Mengirim...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
}

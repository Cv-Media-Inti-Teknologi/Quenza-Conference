import React, { useState } from 'react';
import PaperStatusBadge from './PaperStatusBadge';

export default function PaperDetailModal({ paper, onClose, onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState(paper?.status || 'submitted');
  const [updating, setUpdating] = useState(false);

  const statuses = ['submitted', 'under_review', 'revision_required', 'accepted', 'rejected'];

  const handleStatusUpdate = async () => {
    if (selectedStatus === paper.status) {
      onClose();
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/papers/${paper.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        onStatusChange();
        onClose();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!paper) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-quenza-xl p-6 w-full max-w-2xl shadow-quenza-modal border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">{paper.title}</h3>
            <p className="text-quenza-small text-quenza-text-secondary mt-1">ID: {paper.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-quenza-text-secondary hover:text-quenza-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">Track</label>
            <p className="text-quenza-medium text-quenza-text-primary">{paper.track}</p>
          </div>

          <div>
            <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">Similarity Score</label>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-quenza-md font-quenza-semibold text-quenza-small ${
                paper.similarity_score <= 10 ? 'bg-green-50 text-green-700' :
                paper.similarity_score <= 30 ? 'bg-orange-50 text-orange-700' :
                'bg-red-50 text-red-700'
              }`}>
                {paper.similarity_score}%
              </div>
            </div>
          </div>

          <div>
            <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">Abstract</label>
            <p className="text-quenza-medium text-quenza-text-primary bg-gray-50 p-3 rounded-quenza-md max-h-40 overflow-y-auto">
              {paper.abstract}
            </p>
          </div>

          <div>
            <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">Current Status</label>
            <PaperStatusBadge status={paper.status} />
          </div>

          <div>
            <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">Update Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="quenza-input"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {paper.reviews && paper.reviews.length > 0 && (
            <div>
              <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-2">Reviews</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {paper.reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-quenza-md">
                    <p className="text-quenza-small font-quenza-semibold text-quenza-text-primary">{review.reviewer_name}</p>
                    <p className="text-quenza-small text-quenza-text-secondary mt-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="quenza-btn-outline text-quenza-small font-quenza-medium px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStatusUpdate}
            disabled={updating}
            className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2"
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function ReviewerManagementTab() {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReviewers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);

        const response = await fetch(`/admin/api/reviewers?${params}`);
        const data = await response.json();
        setReviewers(data.data || []);
      } catch (error) {
        console.error('Error fetching reviewers:', error);
        setReviewers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewers();
  }, [search]);

  return (
    <div className="quenza-card rounded-quenza-xl">
      <div className="mb-6">
        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Manajemen Reviewer</h3>
        <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Total reviewer: {reviewers.length}</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama / keahlian"
          className="quenza-input w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-quenza-text-secondary">Loading...</div>
      ) : reviewers.length === 0 ? (
        <div className="text-center py-8 text-quenza-text-secondary">No reviewers found</div>
      ) : (
        <div className="space-y-4">
          {reviewers.map((reviewer, idx) => (
            <div key={idx} className="border border-gray-200 rounded-quenza-lg p-4 hover:bg-gray-50/50 transition-colors flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-quenza-medium font-quenza-bold text-quenza-text-primary">{reviewer.name}</h4>
                <p className="text-quenza-small text-quenza-text-secondary mt-0.5">{reviewer.institution}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {reviewer.expertise && reviewer.expertise.split(',').map((exp, expIdx) => (
                    <span key={expIdx} className="quenza-badge-success text-quenza-small">
                      {exp.trim()}
                    </span>
                  ))}
                </div>
                <p className="text-quenza-small text-quenza-text-secondary mt-2">Papers assigned: {reviewer.assigned_papers || 0}</p>
              </div>
              <button className="text-quenza-primary hover:text-quenza-secondary font-quenza-semibold text-quenza-small transition-colors">
                Detail
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

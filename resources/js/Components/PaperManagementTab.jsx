import React, { useState, useEffect } from 'react';
import PaperDetailModal from './PaperDetailModal';
import PaperStatusBadge from './PaperStatusBadge';

export default function PaperManagementTab() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [trackFilter, setTrackFilter] = useState('Semua Track');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const tracks = ['Semua Track', 'AI & Data Science', 'Pendidikan Digital', 'Kesehatan Masyarakat', 'Ekonomi Digital'];
  const statuses = ['Semua Status', 'submitted', 'under_review', 'revision_required', 'accepted', 'rejected'];

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'Semua Status') params.append('status', statusFilter);
      if (trackFilter !== 'Semua Track') params.append('track', trackFilter);

      const response = await fetch(`/admin/api/papers?${params}`);
      const data = await response.json();
      setPapers(data.data || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [search, statusFilter, trackFilter]);

  const handleViewDetail = async (paper) => {
    try {
      const paperId = paper.id.replace('P-', '');
      const response = await fetch(`/admin/api/papers/${paperId}`);
      const data = await response.json();
      setSelectedPaper(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching paper detail:', error);
    }
  };

  return (
    <div className="quenza-card rounded-quenza-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Kelola Paper</h3>
          <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Manage submission, review status, and paper tracking</p>
        </div>
        <button className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2 rounded-quenza-md shadow-sm">
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Export ZIP (Accepted)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="quenza-input"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Track</label>
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="quenza-input"
          >
            {tracks.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Cari judul paper</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul paper"
            className="quenza-input"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-quenza-text-secondary">Loading papers...</div>
        ) : papers.length === 0 ? (
          <div className="text-center py-8 text-quenza-text-secondary">No papers found</div>
        ) : (
          <table className="w-full text-left border-collapse text-quenza-medium">
            <thead>
              <tr className="text-[11px] text-quenza-text-secondary uppercase tracking-wider font-quenza-bold border-b border-gray-100 bg-gray-50/75">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">JUDUL</th>
                <th className="py-3.5 px-4">TRACK</th>
                <th className="py-3.5 px-4">SIMILARITY</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-quenza-text-primary">
              {papers.map((paper, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'} hover:bg-gray-50/60 transition-colors border-b border-gray-100`}>
                  <td className="py-3.5 px-4 font-quenza-semibold text-quenza-text-secondary">{paper.id}</td>
                  <td className="py-3.5 px-4 font-quenza-medium max-w-xs truncate">{paper.title}</td>
                  <td className="py-3.5 px-4 text-quenza-text-secondary">{paper.track}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-quenza-small font-quenza-semibold ${
                      paper.similarity_score <= 10 ? 'bg-green-50 text-green-700' :
                      paper.similarity_score <= 30 ? 'bg-orange-50 text-orange-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {paper.similarity_score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <PaperStatusBadge status={paper.status} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleViewDetail(paper)}
                      className="text-quenza-primary hover:text-quenza-primary/80 transition-colors focus:outline-none font-quenza-semibold text-quenza-small"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDetailModal && (
        <PaperDetailModal
          paper={selectedPaper}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={fetchPapers}
        />
      )}
    </div>
  );
}

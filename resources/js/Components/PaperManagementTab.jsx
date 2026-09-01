import React, { useState, useEffect } from 'react';
import PaperDetailModal from './PaperDetailModal';
import PaperStatusBadge from './PaperStatusBadge';
import AiReviewerModal from './AiReviewerModal';

export default function PaperManagementTab() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [trackFilter, setTrackFilter] = useState('Semua Track');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingAiFor, setLoadingAiFor] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedAiPaper, setSelectedAiPaper] = useState(null);

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

  const handleViewAiRecommendations = async (paper) => {
    try {
      setLoadingAiFor(paper.id);
      const paperId = paper.id.replace('P-', '');
      const response = await fetch(`/admin/api/papers/${paperId}/ai-recommendations`);
      const data = await response.json();
      setSelectedAiPaper(data);
      setShowAiModal(true);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoadingAiFor(null);
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
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-0.5 rounded-full text-quenza-small font-quenza-semibold ${
                        paper.similarity_score === null ? 'bg-gray-100 text-gray-700' :
                        paper.similarity_score <= 10 ? 'bg-green-50 text-green-700' :
                        paper.similarity_score <= 30 ? 'bg-orange-50 text-orange-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {paper.similarity_score !== null ? `${paper.similarity_score}%` : 'Sedang Diproses...'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <PaperStatusBadge status={paper.status} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewAiRecommendations(paper)}
                        disabled={loadingAiFor === paper.id}
                        className={`px-3 py-1.5 rounded-quenza-md border text-quenza-small transition-colors ${
                          loadingAiFor === paper.id 
                            ? 'bg-purple-50 border-purple-200 text-purple-600 cursor-not-allowed' 
                            : 'border-gray-200 text-quenza-text-secondary hover:bg-gray-50'
                        }`}
                      >
                        {loadingAiFor === paper.id ? (
                          <span className="flex items-center gap-1">
                            <svg className="animate-spin h-3 w-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Loading...
                          </span>
                        ) : 'Reviewer AI'}
                      </button>
                      <button
                        onClick={() => handleViewDetail(paper)}
                        className="px-3 py-1.5 rounded-quenza-md border border-gray-200 text-quenza-small text-quenza-primary hover:bg-gray-50"
                      >
                        Detail
                      </button>
                    </div>
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

      {showAiModal && (
        <AiReviewerModal
          paper={selectedAiPaper}
          onClose={() => setShowAiModal(false)}
          onApprove={(reviewer) => {
            alert(`Fitur belum aktif: Assign Reviewer ${reviewer.name} ke paper ${selectedAiPaper.id}`);
          }}
        />
      )}
    </div>
  );
}

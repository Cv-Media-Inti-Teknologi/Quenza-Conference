import React from 'react';

export default function AiReviewerModal({ paper, onClose, onApprove }) {
  if (!paper) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] p-6 w-full max-w-lg shadow-quenza-modal max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-[18px] font-bold text-black">
            Rekomendasi Reviewer — {paper.id}
          </h3>
          <p className="text-[14px] text-[#3d5a49] mt-1">
            Diurutkan berdasarkan skor kecocokan keahlian<br/>dengan abstrak (Quenza AI).
          </p>
        </div>

        <div className="space-y-3 mb-6 mt-4">
          {paper.recommended_reviewers && paper.recommended_reviewers.length > 0 ? (
            paper.recommended_reviewers.map((reviewer, idx) => (
              <div key={idx} className="border border-gray-400 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#3d5a49] text-[15px]">{reviewer.name}</h4>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {reviewer.match_score_percentage}% cocok &middot; {reviewer.expertise}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => onApprove && onApprove(reviewer)}
                  className="px-4 py-1.5 border border-gray-400 text-gray-700 font-bold rounded-md hover:bg-gray-50 text-[14px] transition-colors"
                >
                  Approve
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Tidak ada rekomendasi tersedia.
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-400 text-[#2A4B3C] font-bold rounded-md hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

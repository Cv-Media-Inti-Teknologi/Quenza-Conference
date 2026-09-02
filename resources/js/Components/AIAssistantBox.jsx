import React, { useState } from 'react';
import SmartNotificationModal from './SmartNotificationModal';

export default function AIAssistantBox({ aiAlerts }) {
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [selectedReviewer, setSelectedReviewer] = useState(null);

    const handleCardClick = (type) => {
        if (type === 'DEADLINE') {
            // DUMMY DATA REVIEWER UNTUK SIMULASI MODAL
            setSelectedReviewer({
                id: 1,
                name: 'Dr. Budi Santoso',
                paperTitle: 'Analisis Algoritma Graph Neural Network pada Deteksi Penipuan',
                deadlineDate: '28 Mei 2026'
            });
            setShowNotificationModal(true);
        }
    };

    return (
        <div className="bg-[#f5f3ff] p-6 rounded-quenza-xl border border-purple-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-quenza-md bg-quenza-ai text-white flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-ai">Quenza AI Asisten</h3>
                    <p className="text-quenza-small text-purple-900 font-quenza-regular">Smart alerts & rekomendasi cerdas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiAlerts.map((alert, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => handleCardClick(alert.type)}
                        className={`bg-white rounded-quenza-lg p-4 flex gap-4 items-start shadow-sm border border-purple-100 transition-colors ${alert.type === 'DEADLINE' ? 'cursor-pointer hover:border-quenza-ai hover:bg-purple-50' : 'hover:border-purple-300'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-quenza-ai flex items-center justify-center shrink-0">
                            {alert.type === 'REKOMENDASI' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            )}
                            {alert.type === 'PLAGIARISM' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            )}
                            {alert.type === 'DEADLINE' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[11px] font-quenza-bold text-quenza-ai tracking-wider uppercase">{alert.type}</h4>
                            <p className="text-quenza-medium text-quenza-text-primary font-quenza-semibold mt-0.5">{alert.title}</p>
                            <p className="text-quenza-small text-quenza-text-secondary font-quenza-regular mt-1">{alert.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal AI Notification */}
            {showNotificationModal && selectedReviewer && (
                <SmartNotificationModal
                    isOpen={showNotificationModal}
                    onClose={() => setShowNotificationModal(false)}
                    reviewerData={selectedReviewer}
                />
            )}
        </div>
    );
}

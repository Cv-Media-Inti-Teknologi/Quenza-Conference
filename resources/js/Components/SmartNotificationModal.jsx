import React, { useState, useEffect } from 'react';

export default function SmartNotificationModal({ isOpen, onClose, reviewerData }) {
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [draft, setDraft] = useState({ subject: '', body: '' });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (isOpen && reviewerData) {
            generateDraft();
        }
    }, [isOpen]);

    const generateDraft = async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/api/ai/smart-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    reviewer_name: reviewerData.name,
                    paper_title: reviewerData.paperTitle,
                    deadline_date: reviewerData.deadlineDate
                })
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                setDraft(data.draft);
            } else {
                throw new Error(data.message || 'Gagal memanggil API.');
            }
        } catch (error) {
            console.error('Failed to generate AI draft', error);
            setDraft({
                subject: 'Gagal membuat draf email',
                body: `Terjadi kesalahan: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        setSending(true);
        try {
            // DUMMY IMPLEMENTATION: Simulasi panggil API untuk kirim email
            const response = await fetch('/admin/api/ai/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(draft)
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                setSuccessMessage(data.message); // Tampilkan dummy message
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to send email', error);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-quenza-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-quenza-ai text-white flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-quenza-large font-quenza-bold text-gray-800">Smart Notification AI</h3>
                            <p className="text-quenza-small text-gray-500 font-quenza-regular">Generate Draf Email Pengingat</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {successMessage ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 bg-green-100 text-quenza-primary rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h4 className="text-quenza-xlarge font-quenza-bold text-gray-800">{successMessage}</h4>
                            <p className="text-quenza-medium text-gray-500 mt-2">Draf email telah dikirimkan ke {reviewerData.name}.</p>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quenza-ai mb-4"></div>
                            <h4 className="text-quenza-large font-quenza-semibold text-quenza-ai animate-pulse">AI sedang merangkai kata...</h4>
                            <p className="text-quenza-medium text-gray-500 mt-2">Membuat draf pengingat yang sangat sopan untuk {reviewerData.name}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-quenza-md p-3 text-quenza-small font-quenza-medium flex gap-2">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Ini adalah draf yang di-generate oleh AI. Silakan periksa kembali dan edit jika perlu sebelum mengirim.</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-quenza-small font-quenza-bold text-gray-700">Kepada</label>
                                <input 
                                    type="text" 
                                    className="border border-gray-300 rounded-quenza-md p-2.5 text-quenza-medium text-gray-600 bg-gray-50 cursor-not-allowed"
                                    value={`${reviewerData.name} (Reviewer)`}
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-quenza-small font-quenza-bold text-gray-700">Subjek</label>
                                <input 
                                    type="text" 
                                    className="border border-gray-300 rounded-quenza-md p-2.5 text-quenza-medium text-gray-800 focus:ring-2 focus:ring-purple-200 focus:border-quenza-ai transition-colors"
                                    value={draft.subject}
                                    onChange={(e) => setDraft({...draft, subject: e.target.value})}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-quenza-small font-quenza-bold text-gray-700">Isi Pesan</label>
                                <textarea 
                                    rows="8"
                                    className="border border-gray-300 rounded-quenza-md p-3 text-quenza-medium text-gray-800 focus:ring-2 focus:ring-purple-200 focus:border-quenza-ai transition-colors"
                                    value={draft.body}
                                    onChange={(e) => setDraft({...draft, body: e.target.value})}
                                ></textarea>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && !successMessage && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button 
                            onClick={generateDraft}
                            disabled={sending}
                            className="px-4 py-2 text-quenza-medium font-quenza-semibold text-quenza-ai hover:bg-purple-50 rounded-quenza-md transition-colors flex items-center gap-2 border border-quenza-ai border-opacity-30"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Generate Ulang
                        </button>
                        <button 
                            onClick={handleSend}
                            disabled={sending}
                            className="px-6 py-2 bg-quenza-ai hover:bg-purple-800 text-white text-quenza-medium font-quenza-semibold rounded-quenza-md transition-colors flex items-center gap-2 shadow-sm"
                        >
                            {sending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    Kirim Email
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

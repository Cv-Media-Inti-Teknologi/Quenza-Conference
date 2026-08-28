import React from 'react';

export default function AIEngineAlerts() {
    const alerts = [
        { title: 'Jadwal belum lengkap', desc: 'Kirim ke Admin Dashboard/Email' },
        { title: 'Notifikasi Perubahan', desc: 'Email otomatis ke presenter & peserta' },
        { title: 'Deadline Dekat', desc: 'Kirim ke Author/Reviewer/Peserta' }
    ];

    return (
        <div className="bg-[#f5f3ff] p-6 rounded-quenza-xl border border-purple-200 shadow-sm mb-10">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-quenza-md bg-quenza-ai text-white flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                </div>
                <div>
                    <h3 className="text-quenza-medium font-quenza-bold text-quenza-ai">Engine AI Assistant — Deteksi Metrik & Tenggat</h3>
                    <p className="text-quenza-small text-purple-900 font-quenza-regular mt-0.5">Smart alert terkirim otomatis ke pihak terkait</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {alerts.map((alert, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-quenza-lg border border-purple-100 shadow-sm flex flex-col justify-center">
                        <h4 className="text-quenza-medium font-quenza-bold text-quenza-text-primary">{alert.title}</h4>
                        <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-1">{alert.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

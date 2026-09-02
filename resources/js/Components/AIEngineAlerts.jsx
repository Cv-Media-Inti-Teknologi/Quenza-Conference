import React from 'react';

export default function AIEngineAlerts() {
    const alerts = [
        { title: 'Jadwal belum lengkap', desc: 'Kirim ke Admin Dashboard/Email' },
        { title: 'Notifikasi Perubahan', desc: 'Email otomatis ke presenter & peserta' },
        { title: 'Deadline Dekat', desc: 'Kirim ke Author/Reviewer/Peserta' }
    ];

    return (
        <section id="ai-assistant-panel" className="bg-purple-50/60 rounded-xl p-6 border border-purple-100 mb-10 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">🪄</span>
                <h3 className="font-bold text-sm text-purple-900">Engine AI Assistant — Deteksi Metrik & Tenggat</h3>
            </div>
            <p className="text-xs text-purple-700 mb-4">Smart alert terkirim otomatis ke pihak terkait</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alerts.map((alert, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                        <h4 className="font-bold text-xs text-gray-900 mb-1">{alert.title}</h4>
                        <p className="text-[11px] text-gray-500">{alert.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}


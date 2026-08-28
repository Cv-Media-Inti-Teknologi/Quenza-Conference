import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function ScheduleParams({ initialParams }) {
    const { data, setData, post, processing } = useForm({
        days: initialParams.days || 2,
        start_time: initialParams.start_time || '11:00',
        end_time: initialParams.end_time || '16:00',
        break_duration: initialParams.break_duration || 15,
        presenter_duration: initialParams.presenter_duration || 40
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/schedule/params');
    };

    return (
        <div className="quenza-card rounded-quenza-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Kelola Parameter Penjadwalan</h3>
                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Konfigurasi waktu, durasi, dan slot presentasi harian</p>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={processing}
                    className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2 rounded-quenza-md shadow-sm"
                >
                    Simpan Parameter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5 uppercase tracking-wider">Jumlah Hari</label>
                    <input 
                        type="text" 
                        value={data.days}
                        onChange={(e) => setData('days', e.target.value)}
                        className="quenza-input font-quenza-medium bg-quenza-bg"
                    />
                </div>
                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5 uppercase tracking-wider">Jam Mulai</label>
                    <input 
                        type="text" 
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        className="quenza-input font-quenza-medium bg-quenza-bg"
                    />
                </div>
                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5 uppercase tracking-wider">Jam Selesai</label>
                    <input 
                        type="text" 
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        className="quenza-input font-quenza-medium bg-quenza-bg"
                    />
                </div>
                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5 uppercase tracking-wider">Jeda Istirahat (menit)</label>
                    <input 
                        type="text" 
                        value={data.break_duration}
                        onChange={(e) => setData('break_duration', e.target.value)}
                        className="quenza-input font-quenza-medium bg-quenza-bg"
                    />
                </div>
                <div>
                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5 uppercase tracking-wider">Durasi / Presenter (menit)</label>
                    <input 
                        type="text" 
                        value={data.presenter_duration}
                        onChange={(e) => setData('presenter_duration', e.target.value)}
                        className="quenza-input font-quenza-medium bg-quenza-bg"
                    />
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { useForm } from '@inertiajs/react';

export default function ScheduleParams({ initialParams = {} }) {
    const { data, setData, post, processing } = useForm({
        days: initialParams.days || 2,
        start_time: initialParams.start_time || '11:00',
        end_time: initialParams.end_time || '16:00',
        break_duration: initialParams.break_duration || 15,
        presenter_duration: initialParams.presenter_duration || 40
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/schedule/params', {
            preserveScroll: true
        });
    };

    return (
        <div className="quenza-card rounded-quenza-xl">
            <div className="mb-4">
                <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Kelola Data Ruangan</h3>
                <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Nama, lokasi/online meet, kapasitas, & topik</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Jumlah Hari</label>
                    <input 
                        type="number" 
                        min="1"
                        max="30"
                        required
                        value={data.days}
                        onChange={(e) => setData('days', parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Jam Mulai</label>
                    <input 
                        type="time" 
                        required
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Jam Selesai</label>
                    <input 
                        type="time" 
                        required
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Jeda istirahat (menit)</label>
                    <input 
                        type="number" 
                        min="0"
                        max="180"
                        required
                        value={data.break_duration}
                        onChange={(e) => setData('break_duration', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Durasi / Presenter (menit)</label>
                    <input 
                        type="number" 
                        min="5"
                        max="300"
                        required
                        value={data.presenter_duration}
                        onChange={(e) => setData('presenter_duration', parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="md:col-span-2 flex justify-end pt-2">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="bg-[#0b603a] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-emerald-800 transition"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Parameter'}
                    </button>
                </div>
            </form>
        </div>
    );
}

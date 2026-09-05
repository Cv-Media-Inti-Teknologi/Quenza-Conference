import React, { useMemo } from 'react';
import { useForm } from '@inertiajs/react';

export default function ScheduleParams({ initialParams = {} }) {
    const defaultValues = useMemo(() => ({
        event_days: String(initialParams.event_days || initialParams.days || ''),
        start_time: initialParams.start_time ? String(initialParams.start_time).substring(0, 5) : '',
        end_time: initialParams.end_time ? String(initialParams.end_time).substring(0, 5) : '',
        break_duration: String(initialParams.break_duration_minutes ?? initialParams.break_duration ?? ''),
        presenter_duration: String(initialParams.presentation_duration_minutes ?? initialParams.presenter_duration ?? ''),
        presenter_count: String(initialParams.presenter_count ?? '')
    }), [initialParams]);

    const { data, setData, post, processing } = useForm(defaultValues);

    const isAnyFieldFilled = Object.values(data).some(
        (val) => val !== '' && val !== null && val !== undefined
    );

    const hasChanges = Object.keys(defaultValues).some(
        (key) => String(data[key] ?? '') !== String(defaultValues[key] ?? '')
    );

    const handleReset = () => {
        setData({
            event_days: '',
            start_time: '',
            end_time: '',
            break_duration: '',
            presenter_duration: '',
            presenter_count: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasChanges) return;
        post('/admin/schedule/params', {
            preserveScroll: true
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
            <div className="mb-6">
                <h2 className="font-bold text-lg text-gray-900 tracking-tight">Konfigurasi Durasi Acara</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                    Jumlah hari, jam operasional, jeda istirahat &amp; durasi presenter (sama rata semua sesi)
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Row 1 */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jumlah Hari</label>
                        <input 
                            type="text" 
                            value={data.event_days}
                            onChange={(e) => setData('event_days', e.target.value)}
                            placeholder="Isi Jumlah Hari"
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jam Mulai</label>
                        <input 
                            type="text" 
                            value={data.start_time}
                            onChange={(e) => setData('start_time', e.target.value)}
                            placeholder="Masukkan Jam Mulai Presenter"
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition"
                        />
                    </div>

                    {/* Row 2 */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jam Selesai</label>
                        <input 
                            type="text" 
                            value={data.end_time}
                            onChange={(e) => setData('end_time', e.target.value)}
                            placeholder="Masukkan Jam Selesai Presenter"
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jeda Istirahat (menit)</label>
                        <input 
                            type="text" 
                            value={data.break_duration}
                            onChange={(e) => setData('break_duration', e.target.value)}
                            placeholder="Masukkan Jeda Itirahat"
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition"
                        />
                    </div>

                    {/* Row 3 */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Durasi / Presenter (menit)</label>
                        <input 
                            type="text" 
                            value={data.presenter_duration}
                            onChange={(e) => setData('presenter_duration', e.target.value)}
                            placeholder="Masukkan Durasi"
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jumlah Presenter</label>
                        <input 
                            type="text" 
                            value={data.presenter_count}
                            onChange={(e) => setData('presenter_count', e.target.value)}
                            placeholder="Masukkan Jumlah Presenter"
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition"
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 pt-4">
                    <button 
                        type="button"
                        onClick={handleReset}
                        disabled={!isAnyFieldFilled || processing}
                        className={`border border-gray-300 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                            !isAnyFieldFilled || processing 
                                ? 'opacity-40 text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'hover:bg-gray-50 text-gray-700 cursor-pointer'
                        }`}
                    >
                        Reset
                    </button>
                    <button 
                        type="submit"
                        disabled={!hasChanges || processing}
                        className={`text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs ${
                            !hasChanges || processing
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#0b603a] hover:bg-[#084c2d] text-white cursor-pointer'
                        }`}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Durasi Acara'}
                    </button>
                </div>
            </form>
        </div>
    );
}

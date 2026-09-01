import React, { useState } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import RoomTable from '../Components/RoomTable';
import ScheduleParams from '../Components/ScheduleParams';
import SchedulingMethodPicker from '../Components/SchedulingMethodPicker';
import PaperAllocationTable from '../Components/PaperAllocationTable';
import AIEngineAlerts from '../Components/AIEngineAlerts';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Schedule({ rooms = [], scheduleParams = {}, allocations = [] }) {
    const [activeMethod, setActiveMethod] = useState('manual');
    const { post, processing } = useForm();
    const { flash } = usePage().props;

    const isPublished = allocations.length > 0 && allocations.every(a => a.is_locked);

    const handlePublish = () => {
        if (allocations.length === 0) {
            alert('Belum ada jadwal yang dialokasikan. Silakan jalankan Auto-Scheduling atau atur jadwal terlebih dahulu.');
            return;
        }
        if (confirm('Apakah Anda yakin ingin mempublikasikan jadwal final? Ini akan mengunci jadwal dan status paper menjadi Published.')) {
            post('/admin/schedule/publish', {
                preserveScroll: true
            });
        }
    };

    return (
        <AdminLayout title="Manajemen Event & Penjadwalan" subtitle="Ruangan, sesi paralel, dan auto-scheduling bebas bentrok">
            <Head title="Manajemen Event & Penjadwalan" />

            {/* Flash Notification */}
            {flash?.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-quenza-lg flex items-center gap-3 shadow-xs">
                    <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-quenza-small font-quenza-medium">{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-quenza-lg flex items-center gap-3 shadow-xs">
                    <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="text-quenza-small font-quenza-medium">{flash.error}</span>
                </div>
            )}
            {flash?.info && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-quenza-lg flex items-center gap-3 shadow-xs">
                    <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-quenza-small font-quenza-medium">{flash.info}</span>
                </div>
            )}

            {/* 1. Kelola Data Ruangan (Tabel) */}
            <RoomTable rooms={rooms} />

            {/* 2. Kelola Parameter Penjadwalan */}
            <ScheduleParams initialParams={scheduleParams} />

            {/* 3. Pilih Metode Penjadwalan & 4. Alokasikan Paper */}
            <div className="flex flex-col gap-6">
                <SchedulingMethodPicker 
                    activeMethod={activeMethod} 
                    setActiveMethod={setActiveMethod} 
                />

                {/* Show allocations if manual or generated via AI */}
                <PaperAllocationTable allocations={allocations} />
            </div>

            {/* 5. Status Terpublikasi & Tombol Aksi */}
            <div className="quenza-card rounded-quenza-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-quenza-md flex items-center justify-center shrink-0 ${
                        isPublished ? 'bg-green-100 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-quenza-medium font-quenza-bold text-quenza-text-primary">
                            Status Publikasi Jadwal: {isPublished ? (
                                <span className="text-emerald-700 font-quenza-bold">Terpublikasi & Terkunci</span>
                            ) : (
                                <span className="text-amber-700 font-quenza-bold">Draf (Belum Dipublikasikan)</span>
                            )}
                        </h4>
                        <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">
                            {isPublished 
                                ? 'Jadwal telah terkunci dan dapat diakses oleh seluruh author dan reviewer.'
                                : 'Presenter & peserta akan menerima notifikasi setelah jadwal final dipublikasikan.'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handlePublish}
                    disabled={processing || isPublished}
                    className={`text-quenza-small font-quenza-semibold px-6 py-2.5 rounded-quenza-md shadow-sm transition-all ${
                        isPublished 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                            : 'quenza-btn-secondary hover:shadow-md'
                    }`}
                >
                    {processing ? 'Memproses...' : isPublished ? 'Jadwal Terpublikasi' : 'Publikasikan Jadwal Final'}
                </button>
            </div>

            {/* 6. Engine AI Assistant */}
            <AIEngineAlerts />
        </AdminLayout>
    );
}

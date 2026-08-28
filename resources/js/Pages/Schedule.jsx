import React, { useState } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import RoomTable from '../Components/RoomTable';
import ScheduleParams from '../Components/ScheduleParams';
import SchedulingMethodPicker from '../Components/SchedulingMethodPicker';
import PaperAllocationTable from '../Components/PaperAllocationTable';
import AIEngineAlerts from '../Components/AIEngineAlerts';
import { Head, useForm } from '@inertiajs/react';

export default function Schedule({ rooms, scheduleParams, allocations }) {
    const [activeMethod, setActiveMethod] = useState('manual');
    const { post, processing } = useForm();

    const handlePublish = () => {
        if (confirm('Apakah Anda yakin ingin mempublikasikan jadwal final? Ini akan mengirim notifikasi email ke pemateri.')) {
            post('/admin/schedule/publish');
        }
    };

    return (
        <AdminLayout title="Manajemen Event & Penjadwalan" subtitle="Ruangan, sesi paralel, dan auto-scheduling bebas bentrok">
            <Head title="Manajemen Event & Penjadwalan" />

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
                    <div className="w-10 h-10 rounded-quenza-md bg-green-50 text-quenza-primary flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-quenza-medium font-quenza-bold text-quenza-text-primary">Status Publikasi Jadwal</h4>
                        <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Presenter & peserta akan menerima email setelah jadwal final dipublikasikan.</p>
                    </div>
                </div>
                <button 
                    onClick={handlePublish}
                    disabled={processing}
                    className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-6 py-2.5 rounded-quenza-md shadow-sm"
                >
                    Publikasikan Jadwal Final
                </button>
            </div>

            {/* 6. Engine AI Assistant */}
            <AIEngineAlerts />
        </AdminLayout>
    );
}

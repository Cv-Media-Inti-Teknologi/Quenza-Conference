import React, { useState } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import RoomTable from '../Components/RoomTable';
import ScheduleParams from '../Components/ScheduleParams';
import SchedulingMethodPicker from '../Components/SchedulingMethodPicker';
import PaperAllocationTable from '../Components/PaperAllocationTable';
import QuenzaAiSchedulingEngine from '../Components/QuenzaAiSchedulingEngine';
import AIEngineAlerts from '../Components/AIEngineAlerts';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Schedule({ rooms = [], scheduleParams = {}, allocations = [] }) {
    const isInitiallyPublished = allocations.length > 0 && allocations.every(a => a.is_locked);
    
    // Default method unselected (null), except if already published from DB
    const [activeMethod, setActiveMethod] = useState(isInitiallyPublished ? 'manual' : null);
    const [workflowStage, setWorkflowStage] = useState(isInitiallyPublished ? 'published' : 'initial');
    const [aiApproved, setAiApproved] = useState(false);
    
    const { post, processing } = useForm();
    const { flash } = usePage().props;

    const handlePublish = () => {
        if (allocations.length === 0) {
            alert('Belum ada jadwal yang dialokasikan. Silakan atur jadwal terlebih dahulu.');
            return;
        }
        post('/admin/schedule/publish', {
            preserveScroll: true,
            onSuccess: () => {
                setWorkflowStage('published');
            }
        });
    };

    const handleApproveAiDraft = () => {
        setAiApproved(true);
        // Otomatis simpan / jalankan auto-schedule di backend jika data kosong
        post('/admin/schedule/auto', {
            preserveScroll: true,
            onSuccess: () => {
                setWorkflowStage('draft_locked');
            }
        });
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

            {/* 3. Pilih Metode Penjadwalan */}
            <SchedulingMethodPicker 
                activeMethod={activeMethod} 
                setActiveMethod={(method) => {
                    setActiveMethod(method);
                    if (method === 'ai') {
                        setAiApproved(false);
                    }
                }} 
            />

            {/* 4. Tampilan Khusus Metode Auto-Scheduling AI */}
            {activeMethod === 'ai' && (
                <QuenzaAiSchedulingEngine 
                    onApproveDraft={handleApproveAiDraft}
                    isProcessingBackend={processing}
                    recommendations={allocations}
                />
            )}

            {/* 5. Alokasikan Paper ke Sesi Ruangan (Muncul jika Manual dipilih atau jika AI Draft sudah disetujui) */}
            {(activeMethod === 'manual' || (activeMethod === 'ai' && aiApproved)) && (
                <PaperAllocationTable 
                    allocations={allocations} 
                    isPublished={isInitiallyPublished || workflowStage === 'published'}
                    onPublish={handlePublish}
                    processing={processing}
                    onWorkflowChange={(stage) => setWorkflowStage(stage)}
                />
            )}

            {/* 6. Engine AI Assistant — Ditampilkan jika sudah dalam status Terpublikasi */}
            {(isInitiallyPublished || workflowStage === 'published') && (
                <AIEngineAlerts />
            )}
        </AdminLayout>
    );
}




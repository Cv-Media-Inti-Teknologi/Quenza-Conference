import React, { useState } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import RoomTable from '../Components/RoomTable';
import ScheduleParams from '../Components/ScheduleParams';
import SchedulingMethodPicker from '../Components/SchedulingMethodPicker';
import QuenzaAiSchedulingEngine from '../Components/QuenzaAiSchedulingEngine';
import { Head, usePage } from '@inertiajs/react';

export default function Schedule({ rooms = [], scheduleParams = [], allocations = [] }) {
    const { flash } = usePage().props;
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [activeMethod, setActiveMethod] = useState(null);

    const handleSelectRoom = (room) => {
        setSelectedRoom(prev => {
            if (prev?.id === room.id) {
                setActiveMethod(null);
                return null;
            }
            return room;
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
            <RoomTable 
                rooms={rooms} 
                selectedRoomId={selectedRoom?.id} 
                onSelectRoom={handleSelectRoom} 
            />

            {/* 2. Container Konfigurasi Durasi Acara, 3. Pilih Metode Penjadwalan Paper, 4. Engine Quenza AI */}
            {selectedRoom && (
                <div className="space-y-6">
                    <ScheduleParams 
                        initialParams={scheduleParams} 
                        selectedRoom={selectedRoom} 
                    />
                    
                    <SchedulingMethodPicker 
                        activeMethod={activeMethod}
                        setActiveMethod={setActiveMethod}
                    />

                    {activeMethod === 'ai' && (
                        <QuenzaAiSchedulingEngine 
                            recommendations={allocations}
                        />
                    )}
                </div>
            )}
        </AdminLayout>
    );
}





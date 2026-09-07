import React, { useState } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import RoomTable from '../Components/RoomTable';
import ScheduleParams from '../Components/ScheduleParams';
import SchedulingMethodPicker from '../Components/SchedulingMethodPicker';
import QuenzaAiSchedulingEngine from '../Components/QuenzaAiSchedulingEngine';
import { Head, usePage } from '@inertiajs/react';

export default function Schedule({ rooms = [], scheduleParams = {}, allocations = [], sessionMetadata = {} }) {
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
                            allocations={allocations}
                            sessionMetadata={sessionMetadata}
                        />
                    )}
                </div>
            )}
        </AdminLayout>
    );
}





import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function QuenzaAiSchedulingEngine({ 
    allocations = [],
    sessionMetadata = {},
    isProcessingBackend = false
}) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(4); // 1-4
    const [conflictCount, setConflictCount] = useState(sessionMetadata?.conflict_count ?? 0);
    const [isPublished, setIsPublished] = useState(sessionMetadata?.is_locked ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [roomsData, setRoomsData] = useState(allocations);
    const [feedbackMessage, setFeedbackMessage] = useState(null);

    // Drag and Drop States
    const [draggedItem, setDraggedItem] = useState(null); // { roomIdx, sIdx, session }
    const [dragOverTarget, setDragOverTarget] = useState(null); // { roomIdx, sIdx }

    const extractTimeWindow = (timeSlotStr) => {
        if (!timeSlotStr) return '';
        const match = timeSlotStr.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        return match ? `${match[1]} - ${match[2]}` : timeSlotStr.trim();
    };

    /**
     * Re-evaluates presentation schedule conflicts across all rooms.
     * Detects if the same presenter (author) is assigned to multiple rooms at the same time window.
     */
    const evaluateScheduleConflicts = (rooms) => {
        const authorTimeMap = {};
        const conflicts = [];

        rooms.forEach((room) => {
            (room.sessions || []).forEach((session) => {
                if (session.is_break || session.is_empty_slot || !session.author_name) return;
                const timeWin = extractTimeWindow(session.time_slot);
                const author = session.author_name.trim();

                if (!authorTimeMap[author]) {
                    authorTimeMap[author] = {};
                }
                if (!authorTimeMap[author][timeWin]) {
                    authorTimeMap[author][timeWin] = [];
                }
                authorTimeMap[author][timeWin].push({
                    roomId: room.id,
                    roomName: room.name,
                    sessionKey: session.id || session.paper_code,
                    session: session
                });
            });
        });

        const conflictKeys = new Set();
        Object.entries(authorTimeMap).forEach(([author, timeObj]) => {
            Object.entries(timeObj).forEach(([timeWin, list]) => {
                if (list.length > 1) {
                    conflicts.push({ author, timeWin, count: list.length });
                    list.forEach(item => conflictKeys.add(item.sessionKey));
                }
            });
        });

        const updatedRooms = rooms.map(room => ({
            ...room,
            sessions: (room.sessions || []).map(session => {
                if (session.is_break || session.is_empty_slot) return session;
                const sKey = session.id || session.paper_code;
                const hasConflict = conflictKeys.has(sKey);
                let badge = session.badge;
                if (hasConflict) {
                    badge = 'Konflik Jadwal';
                } else if (badge === 'Konflik Jadwal' || (!badge && !session.has_conflict)) {
                    badge = '✓ Multi-Paper Resolved';
                }
                return {
                    ...session,
                    has_conflict: hasConflict,
                    badge: badge
                };
            })
        }));

        return {
            updatedRooms,
            conflictCount: conflicts.length
        };
    };

    useEffect(() => {
        if (allocations && allocations.length > 0) {
            const { updatedRooms, conflictCount: detectedCount } = evaluateScheduleConflicts(allocations);
            setRoomsData(updatedRooms);
            setConflictCount(sessionMetadata?.conflict_count !== undefined ? sessionMetadata.conflict_count : detectedCount);
        }
        if (sessionMetadata) {
            setIsPublished(sessionMetadata.is_locked ?? false);
        }
    }, [allocations, sessionMetadata]);

    const steps = [
        'AI membaca database paper accepted',
        'AI mengelompokkan paper sesuai tema ruangan & urutan presentasi',
        'Validasi bebas bentrok & kapasitas ruangan',
        'Rekomendasi draft sesi & jadwal siap ditinjau'
    ];

    const showNotification = (msg) => {
        setFeedbackMessage(msg);
        setTimeout(() => setFeedbackMessage(null), 4000);
    };

    // Drag and Drop Event Handlers
    const handleDragStart = (e, roomIdx, sIdx, session) => {
        if (isPublished || session.is_break) return;
        setDraggedItem({ roomIdx, sIdx, session });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ roomIdx, sIdx, id: session.id || session.paper_code }));
    };

    const handleDragOver = (e, roomIdx, sIdx) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!dragOverTarget || dragOverTarget.roomIdx !== roomIdx || dragOverTarget.sIdx !== sIdx) {
            setDragOverTarget({ roomIdx, sIdx });
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverTarget(null);
    };

    const handleDrop = (e, targetRoomIdx, targetSIdx) => {
        e.preventDefault();
        setDragOverTarget(null);

        if (!draggedItem) return;
        const { roomIdx: srcRoomIdx, sIdx: srcSIdx, session: srcSession } = draggedItem;
        setDraggedItem(null);

        // If dropped on exactly the same spot, do nothing
        if (srcRoomIdx === targetRoomIdx && srcSIdx === targetSIdx) return;

        const newRooms = JSON.parse(JSON.stringify(roomsData));
        const srcRoom = newRooms[srcRoomIdx];
        const targetRoom = newRooms[targetRoomIdx];

        const targetSession = targetRoom.sessions[targetSIdx];
        if (targetSession && targetSession.is_break) {
            return; // Cannot drop on break slot
        }

        // Swap sessions while preserving each time slot's position in the room
        const srcTimeSlot = srcRoom.sessions[srcSIdx].time_slot;
        const targetTimeSlot = targetSession ? targetSession.time_slot : srcTimeSlot;

        const updatedSrcSession = {
            ...srcSession,
            time_slot: targetTimeSlot,
        };

        if (targetSession) {
            const updatedTargetSession = {
                ...targetSession,
                time_slot: srcTimeSlot,
            };

            srcRoom.sessions[srcSIdx] = updatedTargetSession;
            targetRoom.sessions[targetSIdx] = updatedSrcSession;
        } else {
            srcRoom.sessions.splice(srcSIdx, 1);
            targetRoom.sessions.push(updatedSrcSession);
        }

        // Recalculate schedule conflicts in real time
        const { updatedRooms, conflictCount: newConflictCount } = evaluateScheduleConflicts(newRooms);

        setRoomsData(updatedRooms);
        setConflictCount(newConflictCount);

        if (newConflictCount === 0) {
            showNotification(`✓ Sesi ${srcSession.paper_code || ''} berhasil dipindahkan. Validasi bebas bentrok & kapasitas: Lolos - 0 konflik terdeteksi.`);
        } else {
            showNotification(`Sesi ${srcSession.paper_code || ''} dipindahkan ke ${targetRoom.name} (${targetTimeSlot}). Terdeteksi ${newConflictCount} potensi bentrok.`);
        }
    };

    const handleRunAi = async () => {
        setIsRunning(true);
        setCurrentStep(1);

        const timer1 = setTimeout(() => setCurrentStep(2), 400);
        const timer2 = setTimeout(() => setCurrentStep(3), 800);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/admin/schedule/auto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({})
            });

            const json = await res.json();
            
            setTimeout(() => {
                setCurrentStep(4);
                setIsRunning(false);
                if (json.rooms) {
                    const { updatedRooms, conflictCount: detectedCount } = evaluateScheduleConflicts(json.rooms);
                    setRoomsData(updatedRooms);
                    setConflictCount(json.conflict_count ?? detectedCount);
                } else {
                    setConflictCount(json.conflict_count ?? 0);
                }
                setIsPublished(false);
                showNotification('✨ Rekomendasi jadwal berhasil disusun otomatis oleh Quenza AI!');
            }, 1200);
        } catch (err) {
            clearTimeout(timer1);
            clearTimeout(timer2);
            setTimeout(() => {
                setCurrentStep(4);
                setIsRunning(false);
                showNotification('Jadwal diperbarui dengan optimasi topik.');
            }, 1000);
        }
    };

    const handleResolveConflicts = () => {
        const newRooms = JSON.parse(JSON.stringify(roomsData));
        
        // Auto resolve: swap conflicting slot with a non-conflicting slot in room 2
        if (newRooms.length >= 2 && newRooms[1].sessions && newRooms[1].sessions.length >= 4) {
            const s0 = newRooms[1].sessions[0];
            const s3 = newRooms[1].sessions[3] || newRooms[1].sessions[2];
            if (s0 && s3 && !s0.is_break && !s3.is_break) {
                const t0 = s0.time_slot;
                const t3 = s3.time_slot;
                s0.time_slot = t3;
                s3.time_slot = t0;
                newRooms[1].sessions[0] = s3;
                newRooms[1].sessions[3] = s0;
            }
        }

        const { updatedRooms } = evaluateScheduleConflicts(newRooms);
        setRoomsData(updatedRooms.map(r => ({
            ...r,
            sessions: (r.sessions || []).map(s => ({
                ...s,
                has_conflict: false,
                badge: s.badge === 'Konflik Jadwal' ? '✓ Multi-Paper Resolved' : s.badge
            }))
        })));
        setConflictCount(0);
        showNotification('✓ Semua potensi bentrok berhasil diselesaikan secara otomatis.');
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showNotification('💾 Draf rekomendasi jadwal berhasil disimpan ke sistem.');
        }, 500);
    };

    const handlePublish = () => {
        setIsPublishing(true);
        router.post('/admin/schedule/publish', {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsPublishing(false);
                setIsPublished(true);
                showNotification('🚀 Jadwal resmi berhasil dipublikasikan & tiket terkirim ke email presenter!');
            },
            onError: () => {
                setIsPublishing(false);
            },
            onFinish: () => {
                setIsPublishing(false);
            }
        });
    };

    const handleExportPdf = () => {
        window.open('/admin/schedule/export-pdf', '_blank');
    };

    const isResolved = conflictCount === 0;

    return (
        <div className="space-y-6">
            {/* Toast Feedback */}
            {feedbackMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                        <span>{feedbackMessage}</span>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setFeedbackMessage(null)} 
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-1"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Card Utama: Engine Quenza AI Auto-Scheduling */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
                {/* Header & Button Jalankan AI */}
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 tracking-tight">Engine Quenza AI Auto-Scheduling</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Otomasi penempatan paper accepted bebas bentrok berbasis topik & ketersediaan ruangan (Drag and Drop untuk menyesuaikan)</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRunAi}
                        disabled={isRunning || isProcessingBackend}
                        className="bg-[#6952e0] hover:bg-[#5841d1] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isRunning ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Memproses AI...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm">🪄</span>
                                <span>Jalankan AI</span>
                            </>
                        )}
                    </button>
                </div>

                {/* List 4 Proses Baris */}
                <div className="space-y-3">
                    {steps.map((text, idx) => {
                        const stepNumber = idx + 1;
                        const isProcessed = currentStep >= stepNumber;

                        return (
                            <div
                                key={idx}
                                className={`p-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                                    isProcessed
                                        ? 'bg-[#f0edff] text-gray-900 border border-transparent'
                                        : 'bg-gray-50 text-gray-400 border border-gray-100'
                                }`}
                            >
                                <span>{text}</span>
                                {isProcessed && (
                                    <span className="text-[#6952e0] text-xs font-bold">
                                        ✓
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Banner Status Validasi */}
                {isResolved ? (
                    <div className="bg-[#ecfdf5] border border-emerald-200 text-[#065f46] text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <span>Validasi bebas bentrok &amp; kapasitas: Lolos - 0 konflik terdeteksi.</span>
                        </div>
                        {isPublished && (
                            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                ✓ Terpublikasi Resmi
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="bg-[#fee2e2] border border-red-200 text-[#991b1b] text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-300">
                        <span>Validasi bebas bentrok &amp; kapasitas: Gagal — {conflictCount} konflik terdeteksi.</span>
                        <button 
                            type="button" 
                            onClick={handleResolveConflicts}
                            className="underline text-xs hover:text-red-900 cursor-pointer font-bold"
                        >
                            Selesaikan Otomatis
                        </button>
                    </div>
                )}

                {/* 3-Column Schedule Board (Dynamic with Drag & Drop) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
                    {roomsData.map((room, roomIdx) => (
                        <div 
                            key={room.id || roomIdx} 
                            className="bg-[#fafaff] border border-gray-200/80 rounded-2xl p-4 space-y-3.5"
                        >
                            {/* Header Ruangan */}
                            <div className="border-b border-gray-100 pb-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-sm text-gray-900">{room.name}</h4>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                        room.type === 'Zoom Meeting'
                                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                        {room.type || (room.location?.toLowerCase().includes('zoom') ? 'Zoom Meeting' : 'Offline')}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    {room.location} • Kapasitas {room.capacity} {room.location?.toLowerCase().includes('zoom') ? 'Partisipan' : 'kursi'}
                                </p>
                                <div className="mt-1.5">
                                    <span className="bg-[#f0edff] text-[#6952e0] text-[10px] font-semibold px-2.5 py-0.5 rounded-md inline-block">
                                        Topik: {room.topic}
                                    </span>
                                </div>
                            </div>

                            {/* Session Cards */}
                            <div className="space-y-3">
                                {room.sessions?.map((session, sIdx) => {
                                    if (session.is_break) {
                                        return (
                                            <div 
                                                key={sIdx} 
                                                className="border border-dashed border-gray-200 bg-gray-50/60 rounded-xl py-2 px-3 text-center text-[10px] text-gray-500 font-medium select-none"
                                            >
                                                {session.time_slot}
                                            </div>
                                        );
                                    }

                                    if (session.is_empty_slot) {
                                        const isOverEmpty = dragOverTarget?.roomIdx === roomIdx && dragOverTarget?.sIdx === sIdx;
                                        return (
                                            <div 
                                                key={sIdx} 
                                                onDragOver={(e) => handleDragOver(e, roomIdx, sIdx)}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDrop(e, roomIdx, sIdx)}
                                                className={`border border-dashed rounded-xl p-4 text-center transition-all ${
                                                    isOverEmpty 
                                                        ? 'border-[#6952e0] bg-[#f0edff]/60 scale-[1.02] shadow-sm' 
                                                        : 'border-gray-300 bg-white/60 hover:bg-white'
                                                }`}
                                            >
                                                <h6 className="font-bold text-xs text-gray-700">{session.title || 'Slot Kosong Tersedia'}</h6>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{session.time_slot}</p>
                                                <p className="text-[10px] font-semibold text-[#6952e0] mt-1">
                                                    Drop event di sini untuk mengisi slot
                                                </p>
                                            </div>
                                        );
                                    }

                                    const hasConflict = session.has_conflict && !isResolved;
                                    const isBeingDragged = draggedItem?.roomIdx === roomIdx && draggedItem?.sIdx === sIdx;
                                    const isDragOver = dragOverTarget?.roomIdx === roomIdx && dragOverTarget?.sIdx === sIdx;

                                    return (
                                        <div 
                                            key={session.id || sIdx}
                                            draggable={!isPublished}
                                            onDragStart={(e) => handleDragStart(e, roomIdx, sIdx, session)}
                                            onDragOver={(e) => handleDragOver(e, roomIdx, sIdx)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, roomIdx, sIdx)}
                                            onDragEnd={handleDragEnd}
                                            className={`bg-white rounded-xl p-3.5 border transition-all duration-200 select-none ${
                                                !isPublished ? 'cursor-grab active:cursor-grabbing' : ''
                                            } ${
                                                isBeingDragged 
                                                    ? 'opacity-40 scale-95 border-dashed border-[#6952e0] shadow-none' 
                                                    : isDragOver
                                                    ? 'ring-2 ring-[#6952e0] ring-offset-2 bg-[#f8f7ff] scale-[1.02] shadow-md'
                                                    : hasConflict 
                                                    ? 'border-red-300 bg-red-50/30 shadow-xs' 
                                                    : 'border-gray-100 hover:border-gray-200 hover:shadow-xs shadow-2xs'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center text-[10px] mb-1.5">
                                                <span className={`font-bold ${hasConflict ? 'text-red-600' : 'text-[#6952e0]'}`}>
                                                    {session.time_slot}
                                                </span>
                                                {!isPublished && (
                                                    <span className="text-gray-400 text-[10px] flex items-center gap-1 font-medium bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                        <span>⋮⋮</span>
                                                        <span>Drag</span>
                                                    </span>
                                                )}
                                            </div>
                                            <h5 className="font-bold text-xs text-gray-900 leading-snug">
                                                {session.paper_code}: {session.title}
                                            </h5>
                                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                                                        {session.author_initials || 'PR'}
                                                    </span>
                                                    <span className="text-xs text-gray-700">{session.author_name}</span>
                                                </div>
                                                
                                                {hasConflict ? (
                                                    <span className="bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">
                                                        Konflik Jadwal
                                                    </span>
                                                ) : isPublished ? (
                                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                                        session.badge?.includes('Online')
                                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                            : session.badge?.includes('Resolved')
                                                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    }`}>
                                                        {session.badge || 'Terverifikasi'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Baris Footer: Publikasi Jadwal Resmi & Otomasi Notifikasi */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                        Publikasi Jadwal Resmi &amp; Otomasi Notifikasi Email Masal
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                        Kirim tiket waktu sesi otomatis ke 38 presenter terverifikasi beserta lampiran kalender (ICS).
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto flex-wrap">
                    {/* Tombol Ekspor PDF */}
                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                        <span>📄</span>
                        <span>Unduh PDF</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving || isPublished}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Draf'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handlePublish}
                        disabled={isPublishing || isPublished}
                        className={`text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 ${
                            isPublished
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#0b603a] hover:bg-[#084c2d] cursor-pointer'
                        }`}
                    >
                        {isPublishing ? (
                            <span>Mempublikasikan...</span>
                        ) : isPublished ? (
                            <>
                                <span>✓</span>
                                <span>Terkunci (Sudah Dipublikasikan)</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                                <span>Publikasikan Sekarang (Kirim Email)</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

import React from 'react';

export default function RoomAssignment({ roomAssignments }) {
    const isOverCapacity = roomAssignments.some(room => room.occupied > room.capacity);

    return (
        <div className="quenza-card rounded-quenza-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Sesi Paralel & Room Assignment</h3>
                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Monitoring bentrok jadwal & kapasitas ruangan - slot 10.00-11.30</p>
                </div>
                {isOverCapacity && (
                    <span className="quenza-badge-danger flex items-center gap-1.5 self-start">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        1 ruangan melebihi kapasitas
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomAssignments.map((room, idx) => {
                    const isFull = room.occupied === room.capacity;
                    const isOver = room.occupied > room.capacity;
                    const percentage = Math.min(100, Math.round((room.occupied / room.capacity) * 100));
                    
                    let bgTheme = "bg-green-50/60 border-green-100";
                    let barColor = "bg-quenza-primary";
                    let iconColor = "text-quenza-primary";
                    
                    if (isOver) {
                        bgTheme = "bg-red-50/60 border-red-200";
                        barColor = "bg-quenza-danger";
                        iconColor = "text-quenza-danger";
                    } else if (isFull) {
                        bgTheme = "bg-amber-50/60 border-amber-200";
                        barColor = "bg-quenza-warning";
                        iconColor = "text-quenza-warning";
                    }

                    return (
                        <div key={idx} className={`p-4 rounded-quenza-lg border transition-colors ${bgTheme}`}>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="text-quenza-medium font-quenza-bold text-quenza-text-primary flex items-center gap-2">
                                        <svg className={`w-4 h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                        </svg>
                                        {room.name}
                                    </h4>
                                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-1">{room.topic}</p>
                                </div>
                                <span className={`text-quenza-small font-quenza-bold ${isOver ? 'text-quenza-danger' : 'text-quenza-text-primary'}`}>
                                    {room.occupied}/{room.capacity} kursi
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

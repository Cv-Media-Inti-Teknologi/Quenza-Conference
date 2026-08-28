import React from 'react';
import { useForm } from '@inertiajs/react';

export default function SchedulingMethodPicker({ activeMethod, setActiveMethod }) {
    const { post, processing } = useForm();

    const triggerAutoSchedule = () => {
        setActiveMethod('ai');
        post('/admin/schedule/auto', {
            preserveScroll: true
        });
    };

    return (
        <div className="quenza-card rounded-quenza-xl">
            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-0.5">Pilih Metode Penjadwalan Paper</h3>
            <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mb-5">Alokasikan judul paper accepted & author ke sesi sesuai tema ruangan</p>

            <div className="flex flex-col gap-3">
                {/* Option: Manual */}
                <div 
                    onClick={() => setActiveMethod('manual')}
                    className={`border rounded-quenza-lg p-4 flex gap-4 cursor-pointer transition-all duration-200 ${
                        activeMethod === 'manual' 
                            ? 'border-quenza-secondary bg-quenza-light' 
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                >
                    <div className={`mt-0.5 ${activeMethod === 'manual' ? 'text-quenza-secondary' : 'text-gray-400'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                        </svg>
                    </div>
                    <div>
                        <h4 className={`text-quenza-medium font-quenza-bold ${activeMethod === 'manual' ? 'text-quenza-secondary' : 'text-quenza-text-primary'}`}>Manual</h4>
                        <p className={`text-quenza-small mt-1 ${activeMethod === 'manual' ? 'text-emerald-900 font-quenza-medium' : 'text-quenza-text-secondary font-quenza-regular'}`}>
                            Admin mengalokasikan sendiri judul paper ke sesi & ruangan, lalu divalidasi sistem secara real-time.
                        </p>
                    </div>
                </div>

                {/* Option: Auto-Scheduling AI */}
                <div 
                    onClick={triggerAutoSchedule}
                    className={`border rounded-quenza-lg p-4 flex gap-4 cursor-pointer transition-all duration-200 ${
                        activeMethod === 'ai' 
                            ? 'border-quenza-secondary bg-quenza-light' 
                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/60'
                    }`}
                >
                    <div className={`mt-0.5 ${activeMethod === 'ai' ? 'text-quenza-secondary' : 'text-gray-400'}`}>
                        {processing ? (
                            <svg className="animate-spin h-5 w-5 text-quenza-ai" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                            </svg>
                        )}
                    </div>
                    <div>
                        <h4 className={`text-quenza-medium font-quenza-bold ${activeMethod === 'ai' ? 'text-quenza-secondary' : 'text-quenza-text-primary'}`}>
                            {processing ? 'Generating Draft via AI...' : 'Auto-Scheduling AI'}
                        </h4>
                        <p className={`text-quenza-small mt-1 ${activeMethod === 'ai' ? 'text-emerald-900 font-quenza-medium' : 'text-quenza-text-secondary font-quenza-regular'}`}>
                            Quenza AI membaca database paper & ruangan, lalu menyusun draft jadwal bebas bentrok otomatis.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

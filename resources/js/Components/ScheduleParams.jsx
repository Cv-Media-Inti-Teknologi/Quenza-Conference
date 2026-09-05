import React, { useMemo, useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function ScheduleParams({ initialParams = {}, selectedRoom = null }) {
    const [timeModalTarget, setTimeModalTarget] = useState(null); // 'start_time' | 'end_time' | null
    const [selectedHour, setSelectedHour] = useState('11');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const [formValidationError, setFormValidationError] = useState(null);

    const defaultValues = useMemo(() => {
        const setting = selectedRoom?.event_setting;
        return {
            room_id: selectedRoom ? selectedRoom.id : '',
            event_days: setting?.event_days !== undefined && setting?.event_days !== null && setting?.event_days !== '' ? String(setting.event_days) : '',
            start_time: setting?.start_time ? String(setting.start_time).substring(0, 5) : '',
            end_time: setting?.end_time ? String(setting.end_time).substring(0, 5) : '',
            break_duration: setting?.break_duration_minutes !== undefined && setting?.break_duration_minutes !== null && setting?.break_duration_minutes !== '' ? String(setting.break_duration_minutes) : '',
            presenter_duration: setting?.presentation_duration_minutes !== undefined && setting?.presentation_duration_minutes !== null && setting?.presentation_duration_minutes !== '' ? String(setting.presentation_duration_minutes) : '',
            presenter_count: setting?.presenter_count !== undefined && setting?.presenter_count !== null && setting?.presenter_count !== '' ? String(setting.presenter_count) : ''
        };
    }, [selectedRoom]);

    const { data, setData, post, processing } = useForm(defaultValues);

    useEffect(() => {
        setData(defaultValues);
        setFormValidationError(null);
    }, [defaultValues]);

    const isAnyFieldFilled = Object.values(data).some(
        (val) => val !== '' && val !== null && val !== undefined
    );

    const isAllFieldsFilled = Boolean(
        data.event_days !== '' && data.event_days !== null && data.event_days !== undefined &&
        data.start_time !== '' && data.start_time !== null && data.start_time !== undefined &&
        data.end_time !== '' && data.end_time !== null && data.end_time !== undefined &&
        data.break_duration !== '' && data.break_duration !== null && data.break_duration !== undefined &&
        data.presenter_duration !== '' && data.presenter_duration !== null && data.presenter_duration !== undefined &&
        data.presenter_count !== '' && data.presenter_count !== null && data.presenter_count !== undefined
    );

    const hasChanges = Object.keys(defaultValues).some(
        (key) => String(data[key] ?? '') !== String(defaultValues[key] ?? '')
    );

    const isTimeOrderInvalid = Boolean(data.start_time && data.end_time && data.start_time >= data.end_time);

    const handleReset = () => {
        setData({
            room_id: selectedRoom ? selectedRoom.id : '',
            event_days: '',
            start_time: '',
            end_time: '',
            break_duration: '',
            presenter_duration: '',
            presenter_count: ''
        });
        setFormValidationError(null);
    };

    const handleNumberStep = (field, delta, min = 0, step = 1) => {
        const currentVal = data[field] === '' || data[field] === null ? (min > 0 ? min : 0) : parseInt(data[field], 10);
        const nextVal = Math.max(min, (isNaN(currentVal) ? 0 : currentVal) + (delta * step));
        setData(field, String(nextVal));
    };

    const handleKeyDownNumber = (e) => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const openTimeModal = (target) => {
        setTimeModalTarget(target);
        let currentVal = data[target];
        if (!currentVal) {
            if (target === 'start_time') {
                currentVal = '09:00';
            } else {
                currentVal = data.start_time ? `${String(Math.min(23, parseInt(data.start_time.split(':')[0], 10) + 3)).padStart(2, '0')}:00` : '14:00';
            }
        }
        const [h, m] = currentVal.includes(':') ? currentVal.split(':') : ['09', '00'];
        setSelectedHour(h.padStart(2, '0'));
        setSelectedMinute(m.padStart(2, '0'));
    };

    // Calculate time conflict in modal
    const modalSelectedTime = `${selectedHour}:${selectedMinute}`;
    let modalTimeError = null;
    if (timeModalTarget === 'start_time' && data.end_time && modalSelectedTime >= data.end_time) {
        modalTimeError = `Jam mulai (${modalSelectedTime}) harus lebih awal dari jam selesai (${data.end_time}).`;
    } else if (timeModalTarget === 'end_time' && data.start_time && modalSelectedTime <= data.start_time) {
        modalTimeError = `Jam selesai (${modalSelectedTime}) harus lebih akhir dari jam mulai (${data.start_time}).`;
    }

    const applySelectedTime = () => {
        if (!timeModalTarget || modalTimeError) return;
        const formatted = `${selectedHour}:${selectedMinute}`;
        setData(timeModalTarget, formatted);
        setTimeModalTarget(null);
        setFormValidationError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isAllFieldsFilled) {
            setFormValidationError('Semua field wajib diisi lengkap.');
            return;
        }

        if (data.start_time && data.end_time && data.start_time >= data.end_time) {
            setFormValidationError('Jam mulai harus lebih awal dari jam selesai.');
            return;
        }

        if (!hasChanges) return;

        setFormValidationError(null);

        if (selectedRoom) {
            post(`/admin/schedule/room/${selectedRoom.id}/params`, {
                preserveScroll: true,
                preserveState: true
            });
        } else {
            post('/admin/schedule/params', {
                preserveScroll: true,
                preserveState: true
            });
        }
    };

    // Hour options 07 to 22
    const hours = Array.from({ length: 16 }, (_, i) => String(i + 7).padStart(2, '0'));
    // Minute options in 5-minute intervals
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

    const startPresets = ['08:00', '08:30', '09:00', '09:30', '10:00', '11:00', '13:00'];
    const endPresets = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 transition-all relative">
            <div className="mb-6 flex items-center justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-lg text-gray-900 tracking-tight">
                            Konfigurasi Durasi Acara
                        </h2>
                        {selectedRoom && (
                            <span className="bg-[#f0edff] text-[#6952e0] text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200">
                                📍 Ruangan: {selectedRoom.name}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        {selectedRoom 
                            ? `Sesuaikan jam operasional, sesi, jeda istirahat & kapasitas untuk ${selectedRoom.name} (${selectedRoom.topic})`
                            : 'Jumlah hari, jam operasional, jeda istirahat & durasi presenter (sama rata semua sesi)'}
                    </p>
                </div>
            </div>

            {/* Validation Error Banner */}
            {(formValidationError || isTimeOrderInvalid) && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{formValidationError || 'Jam mulai harus lebih awal dari jam selesai acara.'}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <input type="hidden" name="room_id" value={data.room_id} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Row 1: Jumlah Hari & Jam Mulai */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Jumlah Hari <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="number" 
                                min="1"
                                step="1"
                                required
                                value={data.event_days}
                                onKeyDown={handleKeyDownNumber}
                                onChange={(e) => setData('event_days', e.target.value.replace(/\D/g, ''))}
                                placeholder="Isi Jumlah Hari"
                                className="w-full border border-gray-200 rounded-lg pl-3.5 pr-12 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="absolute right-1.5 flex flex-col gap-0.5 select-none">
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('event_days', 1, 1, 1)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Tambah 1 hari"
                                >
                                    ▲
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('event_days', -1, 1, 1)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Kurang 1 hari"
                                >
                                    ▼
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Jam Mulai <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div 
                            onClick={() => openTimeModal('start_time')}
                            className={`w-full border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 flex items-center justify-between cursor-pointer transition group ${
                                isTimeOrderInvalid 
                                    ? 'border-red-300 bg-red-50/20' 
                                    : 'border-gray-200 hover:border-[#0b603a] hover:bg-gray-50/50'
                            }`}
                        >
                            <span className={data.start_time ? 'font-semibold text-gray-900' : 'text-gray-400'}>
                                {data.start_time ? `${data.start_time} WIB` : 'Pilih Jam Mulai'}
                            </span>
                            <div className="flex items-center gap-1.5">
                                {data.start_time && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData('start_time', '');
                                        }}
                                        className="text-gray-400 hover:text-red-500 text-xs px-1"
                                        title="Hapus"
                                    >
                                        ✕
                                    </button>
                                )}
                                <span className="text-gray-400 group-hover:text-[#0b603a] transition">
                                    🕒
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Jam Selesai & Jeda Istirahat */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Jam Selesai <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div 
                            onClick={() => openTimeModal('end_time')}
                            className={`w-full border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 flex items-center justify-between cursor-pointer transition group ${
                                isTimeOrderInvalid 
                                    ? 'border-red-300 bg-red-50/20' 
                                    : 'border-gray-200 hover:border-[#0b603a] hover:bg-gray-50/50'
                            }`}
                        >
                            <span className={data.end_time ? 'font-semibold text-gray-900' : 'text-gray-400'}>
                                {data.end_time ? `${data.end_time} WIB` : 'Pilih Jam Selesai'}
                            </span>
                            <div className="flex items-center gap-1.5">
                                {data.end_time && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData('end_time', '');
                                        }}
                                        className="text-gray-400 hover:text-red-500 text-xs px-1"
                                        title="Hapus"
                                    >
                                        ✕
                                    </button>
                                )}
                                <span className="text-gray-400 group-hover:text-[#0b603a] transition">
                                    🕒
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Jeda Istirahat (menit) <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="number" 
                                min="0"
                                step="1"
                                required
                                value={data.break_duration}
                                onKeyDown={handleKeyDownNumber}
                                onChange={(e) => setData('break_duration', e.target.value.replace(/\D/g, ''))}
                                placeholder="Masukkan Jeda Istirahat"
                                className="w-full border border-gray-200 rounded-lg pl-3.5 pr-12 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="absolute right-1.5 flex flex-col gap-0.5 select-none">
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('break_duration', 1, 0, 5)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Tambah 5 menit"
                                >
                                    ▲
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('break_duration', -1, 0, 5)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Kurang 5 menit"
                                >
                                    ▼
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Durasi Presenter & Jumlah Presenter */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Durasi / Presenter (menit) <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="number" 
                                min="1"
                                step="1"
                                required
                                value={data.presenter_duration}
                                onKeyDown={handleKeyDownNumber}
                                onChange={(e) => setData('presenter_duration', e.target.value.replace(/\D/g, ''))}
                                placeholder="Masukkan Durasi"
                                className="w-full border border-gray-200 rounded-lg pl-3.5 pr-12 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="absolute right-1.5 flex flex-col gap-0.5 select-none">
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('presenter_duration', 1, 1, 5)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Tambah 5 menit"
                                >
                                    ▲
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('presenter_duration', -1, 1, 5)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Kurang 5 menit"
                                >
                                    ▼
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Jumlah Presenter <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="number" 
                                min="0"
                                step="1"
                                required
                                value={data.presenter_count}
                                onKeyDown={handleKeyDownNumber}
                                onChange={(e) => setData('presenter_count', e.target.value.replace(/\D/g, ''))}
                                placeholder="Masukkan Jumlah Presenter"
                                className="w-full border border-gray-200 rounded-lg pl-3.5 pr-12 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0b603a] focus:border-[#0b603a] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="absolute right-1.5 flex flex-col gap-0.5 select-none">
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('presenter_count', 1, 0, 1)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Tambah 1 presenter"
                                >
                                    ▲
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNumberStep('presenter_count', -1, 0, 1)}
                                    className="w-7 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-[#0b603a] hover:text-white text-gray-600 text-[10px] transition cursor-pointer"
                                    title="Kurang 1 presenter"
                                >
                                    ▼
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 pt-4">
                    {/* Satu tombol Reset tunggal */}
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
                        disabled={!hasChanges || !isAllFieldsFilled || isTimeOrderInvalid || processing}
                        className={`text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs ${
                            !hasChanges || !isAllFieldsFilled || isTimeOrderInvalid || processing
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#0b603a] hover:bg-[#084c2d] text-white cursor-pointer'
                        }`}
                    >
                        {processing ? 'Menyimpan...' : selectedRoom ? `Simpan Durasi (${selectedRoom.name})` : 'Simpan Durasi Acara'}
                    </button>
                </div>
            </form>

            {/* Modal Pemilih Jam (Time Picker Modal) */}
            {timeModalTarget && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in"
                    onClick={() => setTimeModalTarget(null)}
                >
                    <div 
                        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3.5">
                            <div>
                                <h3 className="font-bold text-base text-gray-900">
                                    {timeModalTarget === 'start_time' ? '🕒 Pilih Jam Mulai Acara' : '🕒 Pilih Jam Selesai Acara'}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Pilih jam &amp; menit untuk format waktu yang akurat
                                </p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setTimeModalTarget(null)}
                                className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Display Waktu Digital Besar */}
                        <div className={`rounded-xl p-4 text-center border transition-all ${
                            modalTimeError 
                                ? 'bg-red-50/50 border-red-200' 
                                : 'bg-[#fafaff] border-purple-100'
                        }`}>
                            <span className="text-xs text-gray-500 font-medium block mb-1">Pratinjau Waktu Terpilih</span>
                            <div className={`text-3xl font-black tracking-wider font-mono ${
                                modalTimeError ? 'text-red-600' : 'text-[#6952e0]'
                            }`}>
                                {selectedHour} : {selectedMinute} <span className="text-sm font-semibold text-gray-500">WIB</span>
                            </div>
                            {modalTimeError && (
                                <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center justify-center gap-1">
                                    <span>⚠️</span>
                                    <span>{modalTimeError}</span>
                                </p>
                            )}
                        </div>

                        {/* Preset Waktu Cepat */}
                        <div>
                            <span className="text-[11px] font-semibold text-gray-500 block mb-2">Preset Waktu Populer:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {(timeModalTarget === 'start_time' ? startPresets : endPresets).map((preset) => {
                                    const [ph, pm] = preset.split(':');
                                    const isSelected = selectedHour === ph && selectedMinute === pm;
                                    return (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => {
                                                setSelectedHour(ph);
                                                setSelectedMinute(pm);
                                            }}
                                            className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#6952e0] text-white border-[#6952e0]'
                                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            {preset}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Grid Pemilih Jam & Menit */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Kolom Jam */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Jam (07 - 22)</label>
                                <div className="h-44 overflow-y-auto border border-gray-200 rounded-xl p-1.5 space-y-1 bg-gray-50/40">
                                    {hours.map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => setSelectedHour(h)}
                                            className={`w-full py-1.5 rounded-lg text-xs font-semibold text-center transition cursor-pointer ${
                                                selectedHour === h
                                                    ? 'bg-[#0b603a] text-white shadow-xs'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {h} : 00
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kolom Menit */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Menit</label>
                                <div className="h-44 overflow-y-auto border border-gray-200 rounded-xl p-1.5 space-y-1 bg-gray-50/40">
                                    {minutes.map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setSelectedMinute(m)}
                                            className={`w-full py-1.5 rounded-lg text-xs font-semibold text-center transition cursor-pointer ${
                                                selectedMinute === m
                                                    ? 'bg-[#6952e0] text-white shadow-xs'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            : {m} menit
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tombol Aksi Modal */}
                        <div className="flex justify-end items-center gap-2.5 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setTimeModalTarget(null)}
                                className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={applySelectedTime}
                                disabled={Boolean(modalTimeError)}
                                className={`text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition shadow-xs flex items-center gap-1.5 ${
                                    modalTimeError
                                        ? 'bg-gray-300 cursor-not-allowed opacity-60'
                                        : 'bg-[#0b603a] hover:bg-[#084c2d] cursor-pointer'
                                }`}
                            >
                                <span>✓</span>
                                <span>Terapkan Waktu</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

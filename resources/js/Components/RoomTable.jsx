import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function RoomTable({ rooms = [], selectedRoomId = null, onSelectRoom = null }) {
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deletingRoom, setDeletingRoom] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        location: '',
        capacity: '',
        topic: ''
    });

    const openAddModal = (e) => {
        if (e) e.stopPropagation();
        setEditingRoom(null);
        clearErrors();
        reset();
        setData({
            name: '',
            location: '',
            capacity: '',
            topic: ''
        });
        setShowModal(true);
    };

    const openEditModal = (room, e) => {
        if (e) e.stopPropagation();
        setEditingRoom(room);
        clearErrors();
        setData({
            name: room.name || '',
            location: room.location || '',
            capacity: String(room.capacity || '').replace(/\D/g, ''),
            topic: room.topic || ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRoom(null);
        clearErrors();
        reset();
    };

    const openDeleteModal = (room, e) => {
        if (e) e.stopPropagation();
        setDeletingRoom(room);
    };

    const closeDeleteModal = () => {
        if (isDeleting) return;
        setDeletingRoom(null);
    };

    const confirmDelete = () => {
        if (!deletingRoom) return;
        router.delete(`/admin/schedule/room/${deletingRoom.id}`, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setDeletingRoom(null);
            }
        });
    };

    const isFormValid = Boolean(
        data.name && String(data.name).trim() !== '' &&
        data.location && String(data.location).trim() !== '' &&
        data.capacity !== '' && data.capacity !== null && data.capacity !== undefined &&
        data.topic && String(data.topic).trim() !== ''
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        if (editingRoom) {
            put(`/admin/schedule/room/${editingRoom.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    closeModal();
                }
            });
        } else {
            post('/admin/schedule/room', {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    closeModal();
                }
            });
        }
    };

    const formatCapacity = (capacity, location = '') => {
        if (!capacity && capacity !== 0) return '-';
        const str = String(capacity).trim();
        if (/[a-zA-Z]/.test(str)) {
            return str;
        }
        const locLower = (location || '').toLowerCase();
        if (locLower.includes('zoom') || locLower.includes('virtual') || locLower.includes('online')) {
            return `${str} Partisipan`;
        }
        return `${str} kursi`;
    };

    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="font-bold text-lg text-gray-900 tracking-tight">Kelola Data Ruangan</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Nama, lokasi/online meet, kapasitas, &amp; topik</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="bg-[#0b603a] hover:bg-[#084c2d] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                    + Tambah Ruangan
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                        <tr className="text-xs text-gray-900 font-bold border-b border-gray-100/60">
                            <th className="py-3 px-3 font-bold tracking-wide">NAMA RUANGAN</th>
                            <th className="py-3 px-3 font-bold tracking-wide">LOKASI</th>
                            <th className="py-3 px-3 font-bold tracking-wide">KAPASITAS</th>
                            <th className="py-3 px-3 font-bold tracking-wide">TOPIK</th>
                            <th className="py-3 px-3 font-bold tracking-wide">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 divide-y divide-gray-50/80">
                        {rooms.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 px-4 text-center text-gray-400 text-xs">
                                    Belum ada data ruangan. Klik tombol "+ Tambah Ruangan" untuk menambahkan.
                                </td>
                            </tr>
                        ) : (
                            rooms.map((room, idx) => {
                                const isSelected = selectedRoomId === room.id;
                                return (
                                    <tr 
                                        key={room.id || idx} 
                                        onClick={() => onSelectRoom && onSelectRoom(room)}
                                        className={`cursor-pointer transition-colors ${
                                            isSelected 
                                                ? 'bg-[#f4f3ff] hover:bg-[#ece9fe]' 
                                                : 'hover:bg-gray-50/60'
                                        }`}
                                    >
                                        <td className="py-4 px-3 font-medium text-gray-900">{room.name}</td>
                                        <td className="py-4 px-3 text-gray-700">{room.location}</td>
                                        <td className="py-4 px-3 text-gray-900">{formatCapacity(room.capacity, room.location)}</td>
                                        <td className="py-4 px-3 text-gray-900">{room.topic}</td>
                                        <td className="py-4 px-3">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => openEditModal(room, e)}
                                                    className="text-[#6366f1] hover:text-[#4f46e5] p-1 rounded transition-colors"
                                                    title="Edit Ruangan"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => openDeleteModal(room, e)}
                                                    className="text-[#dc2626] hover:text-[#b91c1c] p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Hapus Ruangan"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah / Edit Ruangan */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-quenza-xl p-6 w-full max-w-md shadow-quenza-modal border border-gray-100">
                        <h4 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">
                            {editingRoom ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                        </h4>
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">
                                    Nama Ruangan <span className="text-red-500 font-bold ml-0.5">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Ruang Garuda"
                                    className="quenza-input"
                                />
                                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">
                                    Lokasi <span className="text-red-500 font-bold ml-0.5">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Contoh: Lantai 2, Offline / Zoom Meeting"
                                    className="quenza-input"
                                />
                                {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">
                                        Kapasitas <span className="text-red-500 font-bold ml-0.5">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        step="1"
                                        required
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        placeholder="Contoh: 120"
                                        className="quenza-input"
                                    />
                                    {errors.capacity && <p className="text-red-600 text-xs mt-1">{errors.capacity}</p>}
                                </div>
                                <div>
                                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">
                                        Topik <span className="text-red-500 font-bold ml-0.5">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={data.topic}
                                        onChange={(e) => setData('topic', e.target.value)}
                                        placeholder="Contoh: AI & ML"
                                        className="quenza-input"
                                    />
                                    {errors.topic && <p className="text-red-600 text-xs mt-1">{errors.topic}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="quenza-btn-outline text-quenza-small font-quenza-medium px-4 py-2 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={!isFormValid || processing}
                                    className={`quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2 ${
                                        !isFormValid || processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                >
                                    {processing ? 'Menyimpan...' : (editingRoom ? 'Perbarui Ruangan' : 'Simpan Ruangan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Ruangan */}
            {deletingRoom && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={closeDeleteModal}
                >
                    <div 
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0 border border-red-100">
                                🗑️
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-gray-900 tracking-tight">
                                    Hapus Ruangan?
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>

                        {/* Ringkasan Ruangan yang Dihapus */}
                        <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-medium">Nama Ruangan:</span>
                                <span className="font-bold text-gray-900">{deletingRoom.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-medium">Lokasi:</span>
                                <span className="font-semibold text-gray-800">{deletingRoom.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-medium">Topik:</span>
                                <span className="font-semibold text-gray-800">{deletingRoom.topic}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-medium">Kapasitas:</span>
                                <span className="font-semibold text-gray-800">{formatCapacity(deletingRoom.capacity, deletingRoom.location)}</span>
                            </div>
                        </div>

                        {/* Peringatan Bahaya */}
                        <div className="bg-red-50/70 border border-red-200 rounded-xl p-3 text-red-700 text-xs flex items-start gap-2">
                            <span className="text-sm shrink-0">⚠️</span>
                            <span>
                                Menghapus ruangan ini akan otomatis menghapus konfigurasi acara dan seluruh sesi presentasi paper yang dialokasikan di dalamnya.
                            </span>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end items-center gap-2.5 pt-2 border-t border-gray-100">
                            <button 
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button 
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="animate-spin text-xs">⏳</span>
                                        <span>Menghapus...</span>
                                    </>
                                ) : (
                                    <span>Ya, Hapus Ruangan</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

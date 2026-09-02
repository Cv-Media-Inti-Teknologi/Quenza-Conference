import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function RoomTable({ rooms = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        location: '',
        capacity: '',
        topic: ''
    });

    const openAddModal = () => {
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

    const openEditModal = (room) => {
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

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus ruangan ini? Semua jadwal terkait akan terhapus.')) {
            router.delete(`/admin/schedule/room/${id}`, {
                preserveScroll: true
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRoom) {
            put(`/admin/schedule/room/${editingRoom.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                }
            });
        } else {
            post('/admin/schedule/room', {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                }
            });
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="font-bold text-lg text-gray-900">Kelola Data Ruangan</h2>
                    <p className="text-xs text-gray-500">Nama, lokasi/online meet, kapasitas, & topik</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="bg-[#0b603a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-800 transition"
                >
                    + Tambah Ruangan
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-quenza-medium">
                    <thead>
                        <tr className="text-[11px] text-quenza-text-secondary uppercase tracking-wider font-quenza-bold border-b border-gray-100 bg-gray-50/75">
                            <th className="py-3.5 px-4">NAMA RUANGAN</th>
                            <th className="py-3.5 px-4">LOKASI</th>
                            <th className="py-3.5 px-4">KAPASITAS</th>
                            <th className="py-3.5 px-4">TOPIK</th>
                            <th className="py-3.5 px-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-quenza-text-primary">
                        {rooms.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-6 px-4 text-center text-quenza-text-secondary">
                                    Belum ada data ruangan. Klik tombol "Tambah Ruangan" untuk menambahkan.
                                </td>
                            </tr>
                        ) : (
                            rooms.map((room, idx) => (
                                <tr key={room.id || idx} className={`${idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'} hover:bg-gray-50/60 transition-colors border-b border-gray-100`}>
                                    <td className="py-3.5 px-4 font-quenza-medium">{room.name}</td>
                                    <td className="py-3.5 px-4 text-quenza-text-secondary">{room.location}</td>
                                    <td className="py-3.5 px-4 font-quenza-semibold">{room.capacity}</td>
                                    <td className="py-3.5 px-4 text-quenza-secondary font-quenza-semibold">{room.topic}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button 
                                                onClick={() => openEditModal(room)}
                                                className="text-quenza-text-secondary hover:text-quenza-secondary transition-colors p-1.5 rounded hover:bg-gray-100"
                                                title="Edit Ruangan"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(room.id)}
                                                className="text-quenza-danger hover:text-red-700 transition-colors p-1.5 rounded hover:bg-red-50"
                                                title="Hapus Ruangan"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah / Edit Ruangan */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-quenza-xl p-6 w-full max-w-md shadow-quenza-modal border border-gray-100">
                        <h4 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">
                            {editingRoom ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Nama Ruangan</label>
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
                                <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Lokasi</label>
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
                                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Kapasitas</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        required
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        placeholder="Contoh: 120"
                                        className="quenza-input"
                                    />
                                    {errors.capacity && <p className="text-red-600 text-xs mt-1">{errors.capacity}</p>}
                                </div>
                                <div>
                                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Topik</label>
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
                                    className="quenza-btn-outline text-quenza-small font-quenza-medium px-4 py-2"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2"
                                >
                                    {processing ? 'Menyimpan...' : (editingRoom ? 'Perbarui Ruangan' : 'Simpan Ruangan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

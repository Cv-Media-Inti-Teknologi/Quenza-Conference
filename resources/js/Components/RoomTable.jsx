import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function RoomTable({ rooms }) {
    const { delete: destroy, post, processing } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [newRoom, setNewRoom] = useState({
        name: '',
        location: '',
        capacity: '',
        topic: ''
    });

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
            destroy(`/admin/schedule/room/${id}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/schedule/room', {
            data: newRoom,
            onSuccess: () => {
                setShowModal(false);
                setNewRoom({ name: '', location: '', capacity: '', topic: '' });
            }
        });
    };

    return (
        <div className="quenza-card rounded-quenza-xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Kelola Data Ruangan</h3>
                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">Nama, lokasi/online meet, kapasitas, & topik</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2 rounded-quenza-md shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Tambah Ruangan
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
                            <th className="py-3.5 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-quenza-text-primary">
                        {rooms.map((room, idx) => (
                            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'} hover:bg-gray-50/60 transition-colors border-b border-gray-100`}>
                                <td className="py-3.5 px-4 font-quenza-medium">{room.name}</td>
                                <td className="py-3.5 px-4 text-quenza-text-secondary">{room.location}</td>
                                <td className="py-3.5 px-4 font-quenza-semibold">{room.capacity}</td>
                                <td className="py-3.5 px-4 text-quenza-secondary font-quenza-semibold">{room.topic}</td>
                                <td className="py-3.5 px-4 text-center">
                                    <button 
                                        onClick={() => handleDelete(room.id)}
                                        className="text-quenza-danger hover:text-red-700 transition-colors focus:outline-none p-1 rounded hover:bg-red-50"
                                    >
                                        <svg className="w-4.5 h-4.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Room Modal (visual only/connected to state form) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-quenza-xl p-6 w-full max-w-md shadow-quenza-modal border border-gray-100">
                        <h4 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">Tambah Ruangan Baru</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Nama Ruangan</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newRoom.name}
                                    onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                                    placeholder="Contoh: Ruang Garuda"
                                    className="quenza-input"
                                />
                            </div>
                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Lokasi</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newRoom.location}
                                    onChange={(e) => setNewRoom({...newRoom, location: e.target.value})}
                                    placeholder="Contoh: Lantai 2, Offline / Zoom"
                                    className="quenza-input"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Kapasitas</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newRoom.capacity}
                                        onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                                        placeholder="Contoh: 120 kursi"
                                        className="quenza-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-quenza-small font-quenza-semibold text-quenza-text-secondary mb-1.5">Topik</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newRoom.topic}
                                        onChange={(e) => setNewRoom({...newRoom, topic: e.target.value})}
                                        placeholder="Contoh: AI & ML"
                                        className="quenza-input"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="quenza-btn-outline text-quenza-small font-quenza-medium px-4 py-2"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="quenza-btn-secondary text-quenza-small font-quenza-semibold px-4 py-2"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

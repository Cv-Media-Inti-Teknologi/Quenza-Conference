import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import TicketPricingForm from '../../Components/Ticketing/TicketPricingForm';
import TicketListTable from '../../Components/Ticketing/TicketListTable';
import TransactionLogForm from '../../Components/Ticketing/TransactionLogForm';

export default function Ticketing({ ticketPricing, ticketList }) {
    const [activeTab, setActiveTab] = useState('atur_biaya');
    const [toast, setToast] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleSuccess = (message) => {
        showToast(message, 'success');
        setRefreshKey(prev => prev + 1);
    };

    const tabs = [
        { id: 'atur_biaya', label: 'Atur Biaya Pendaftaran' },
        { id: 'daftar_tiket', label: 'Daftar Tiket Penjualan' },
        { id: 'pendataan_penjualan', label: 'Pendataan Penjualan / Pengurangan Manual' },
    ];

    return (
        <AdminLayout
            title="Ticketing"
            subtitle="Kelola biaya tiket, daftar penjualan, dan pendataan transaksi"
        >
            <Head title="Ticketing - Manajemen Tiket" />

            {/* Toast Notifications */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 px-5 py-4 rounded-quenza-xl flex items-center gap-3 shadow-md z-50 ${
                        toast.type === 'error'
                            ? 'bg-red-50 border border-red-300 text-red-900'
                            : toast.type === 'info'
                            ? 'bg-blue-50 border border-blue-300 text-blue-900'
                            : 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                    }`}
                >
                    <span className="text-quenza-medium font-quenza-semibold">{toast.message}</span>
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-gray-200 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 font-quenza-medium text-quenza-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? 'border-quenza-primary text-quenza-primary'
                                : 'border-transparent text-quenza-text-secondary hover:text-quenza-text-primary'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'atur_biaya' && (
                    <TicketPricingForm
                        key={refreshKey}
                        initialData={ticketPricing}
                        onSuccess={() => handleSuccess('Biaya tiket berhasil diperbarui')}
                    />
                )}

                {activeTab === 'daftar_tiket' && (
                    <TicketListTable
                        key={refreshKey}
                        initialData={ticketList}
                    />
                )}

                {activeTab === 'pendataan_penjualan' && (
                    <TransactionLogForm
                        key={refreshKey}
                        onSuccess={() => handleSuccess('Data transaksi berhasil disimpan')}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

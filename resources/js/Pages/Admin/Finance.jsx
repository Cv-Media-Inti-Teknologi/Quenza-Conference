import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import FinanceMetricCard from '../../Components/Finance/FinanceMetricCard';
import KasMasukTable from '../../Components/Finance/KasMasukTable';
import KasKeluarTable from '../../Components/Finance/KasKeluarTable';
import PengembalianDanaTable from '../../Components/Finance/PengembalianDanaTable';
import ReportsTab from '../../Components/Finance/ReportsTab';
import FinanceChart from '../../Components/Finance/FinanceChart';

export default function Finance({ initialMetrics }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('kas_masuk');
    const [metrics, setMetrics] = useState(initialMetrics);
    const [chartData, setChartData] = useState({ income: [], expense: [] });
    const [toast, setToast] = useState(null);
    const [filters, setFilters] = useState({
        startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchMetrics();
        fetchChartData();
    }, [filters]);

    const fetchMetrics = async () => {
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/admin/api/finance/metrics?${params}`);
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            showToast('Gagal mengambil data metrics', 'error');
        }
    };

    const fetchChartData = async () => {
        try {
            const response = await fetch('/admin/api/finance/chart');
            const data = await response.json();
            setChartData(data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleExport = async (format) => {
        try {
            const params = new URLSearchParams({ ...filters, format });
            const response = await fetch(`/admin/api/finance/export?${params}`);
            const data = await response.json();
            
            if (format === 'excel') {
                showToast('Export Excel dalam proses...', 'info');
            } else {
                showToast('Export PDF dalam proses...', 'info');
            }
        } catch (error) {
            showToast('Gagal mengexport laporan', 'error');
        }
    };

    const tabs = [
        { id: 'kas_masuk', label: 'Kas Masuk' },
        { id: 'kas_keluar', label: 'Kas Keluar' },
        { id: 'pengembalian_dana', label: 'Pengembalian Dana' },
        { id: 'reports', label: 'Laporan' },
    ];

    return (
        <AdminLayout
            title="Manajemen Keuangan"
            subtitle="Verifikasi akun, ubah role, dan kelola akses"
        >
            <Head title="Manajemen Keuangan" />

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

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FinanceMetricCard
                    title="Gross Income"
                    value={metrics?.gross_income || 0}
                    subtitle="Tiket + Sponsor + Hibah"
                    icon="income"
                />
                <FinanceMetricCard
                    title="Total Expense"
                    value={metrics?.total_expense || 0}
                    subtitle="Hotel, Venue, Honor"
                    icon="expense"
                />
                <FinanceMetricCard
                    title="Net Balance"
                    value={metrics?.net_balance || 0}
                    subtitle="Arus kas positif"
                    icon="balance"
                />
            </div>

            {/* Charts Section */}
            <FinanceChart data={chartData} />

            {/* Tabs Navigation */}
            <div className="flex gap-2 mt-6 border-b border-gray-200">
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
                {activeTab === 'kas_masuk' && (
                    <KasMasukTable
                        filters={filters}
                        setFilters={setFilters}
                        onSuccess={() => {
                            fetchMetrics();
                            showToast('Data berhasil diperbarui', 'success');
                        }}
                    />
                )}

                {activeTab === 'kas_keluar' && (
                    <KasKeluarTable
                        filters={filters}
                        setFilters={setFilters}
                        onSuccess={() => {
                            fetchMetrics();
                            showToast('Data berhasil diperbarui', 'success');
                        }}
                    />
                )}

                {activeTab === 'pengembalian_dana' && (
                    <PengembalianDanaTable
                        filters={filters}
                        setFilters={setFilters}
                        onSuccess={() => {
                            fetchMetrics();
                            showToast('Data berhasil diperbarui', 'success');
                        }}
                    />
                )}

                {activeTab === 'reports' && (
                    <ReportsTab
                        metrics={metrics}
                        filters={filters}
                        setFilters={setFilters}
                        onExport={handleExport}
                    />
                )}
            </div>

            {/* Export Buttons */}
            {activeTab === 'reports' && (
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="quenza-btn-outline px-4 py-2 text-quenza-medium font-quenza-medium border-quenza-primary text-quenza-tertiary hover:bg-green-50"
                    >
                        Ekspor Laporan
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="quenza-btn-primary px-4 py-2 text-quenza-medium font-quenza-medium"
                    >
                        + Laporan & Biaya
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}

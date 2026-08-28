import React from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import MetricCard from '../Components/MetricCard';
import ConferenceTimeline from '../Components/ConferenceTimeline';
import FinanceTable from '../Components/FinanceTable';
import AIAssistantBox from '../Components/AIAssistantBox';
import RoomAssignment from '../Components/RoomAssignment';
import { Head } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard({ metrics, timeline, registrationTrend, paperStatus, financeMutations, aiAlerts, roomAssignments }) {
    // Recharts Data Setup
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold">
                {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
            </text>
        );
    };

    return (
        <AdminLayout title="Dasboard Utama" subtitle="Ringkasan operasional & keuangan real-time">
            <Head title="Dashboard Utama" />

            {/* 1. Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    title="Tiket Terjual" 
                    value={metrics.tickets_sold.value} 
                    change={metrics.tickets_sold.change} 
                    trend={metrics.tickets_sold.trend}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                        </svg>
                    }
                />
                <MetricCard 
                    title="Status Paper" 
                    value={metrics.total_papers.value} 
                    label={metrics.total_papers.label}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    }
                />
                <MetricCard 
                    title="Kas Masuk" 
                    value={metrics.cash_in.value} 
                    change={metrics.cash_in.change} 
                    trend={metrics.cash_in.trend}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    }
                />
                <MetricCard 
                    title="Kas Keluar" 
                    value={metrics.cash_out.value} 
                    label={metrics.cash_out.label}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                        </svg>
                    }
                />
            </div>

            {/* 2. Linimasa Konferensi */}
            <ConferenceTimeline timeline={timeline} />

            {/* 3. Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart (Tren Pendaftar) */}
                <div className="lg:col-span-2 quenza-card rounded-quenza-xl flex flex-col h-80">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Tren Pendaftar</h3>
                            <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary">Pola waktu pendaftaran harian/bulanan</p>
                        </div>
                        <div className="flex bg-gray-100 rounded-quenza-md p-1 text-quenza-small">
                            <button className="px-3 py-1 rounded-quenza-sm bg-white shadow-sm font-quenza-medium text-quenza-text-primary">Harian</button>
                            <button className="px-3 py-1 rounded-quenza-sm text-quenza-text-secondary hover:text-quenza-text-primary transition-colors font-quenza-regular">Mingguan</button>
                            <button className="px-3 py-1 rounded-quenza-sm text-quenza-text-secondary hover:text-quenza-text-primary transition-colors font-quenza-regular">Bulanan</button>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={registrationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPendaftar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#20D375" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#20D375" stopOpacity={0.01}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="pendaftar" stroke="#20D375" strokeWidth={2} fillOpacity={1} fill="url(#colorPendaftar)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Donut Chart (Rasio Status Paper) */}
                <div className="quenza-card rounded-quenza-xl flex flex-col h-80">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">Rasio Status Paper</h3>
                        <select className="text-quenza-small border border-gray-300 rounded-quenza-md py-1 px-2 text-quenza-text-secondary bg-white focus:outline-none">
                            <option>Semua Waktu</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-center justify-center relative min-h-0">
                        <div className="w-full h-full relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paperStatus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        innerRadius={50}
                                        outerRadius={75}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {paperStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute text-center">
                                <span className="block text-quenza-2xlarge font-quenza-bold text-quenza-text-primary">{metrics.total_papers.value}</span>
                                <span className="text-[10px] text-quenza-text-secondary font-quenza-regular">Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4 text-quenza-small justify-center">
                        {paperStatus.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-quenza-text-secondary font-quenza-regular">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Data Table (Keuangan & Mutasi) */}
            <FinanceTable financeMutations={financeMutations} />

            {/* 5. Quenza AI Assistant Box */}
            <AIAssistantBox aiAlerts={aiAlerts} />

            {/* 6. Sesi Paralel & Room Assignment */}
            <RoomAssignment roomAssignments={roomAssignments} />
        </AdminLayout>
    );
}

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function FinanceChart({ data }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const mergedData = data.income?.map((income, idx) => ({
        name: income.name,
        income: income.value,
        expense: data.expense?.[idx]?.value || 0,
    })) || [];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const netBalance = data.income - data.expense;
            
            return (
                <div className="bg-white p-4 rounded-quenza-md shadow-quenza-modal border border-gray-200">
                    <p className="text-quenza-small font-quenza-semibold text-quenza-text-primary mb-2">
                        {data.name} 2026
                    </p>
                    <div className="space-y-1 text-quenza-small">
                        <div className="flex justify-between gap-3">
                            <span className="text-emerald-600 font-quenza-semibold">Pemasukan:</span>
                            <span className="font-quenza-bold text-emerald-700">{formatCurrency(data.income)}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-red-600 font-quenza-semibold">Pengeluaran:</span>
                            <span className="font-quenza-bold text-red-700">{formatCurrency(data.expense)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-1 mt-1">
                            <div className="flex justify-between gap-3">
                                <span className={`font-quenza-semibold ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    Saldo Bersih:
                                </span>
                                <span className={`font-quenza-bold ${netBalance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {formatCurrency(netBalance)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="quenza-card rounded-quenza-xl p-6 mt-6">
            <div className="mb-4">
                <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                    Permantuaan Statistik Real-time
                </h3>
                <p className="text-quenza-small text-quenza-text-secondary mt-1">
                    Perbandingan tren pemasukan vs pengeluaran bulanan
                </p>
            </div>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mergedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => {
                                if (value >= 1000000) {
                                    return `Rp ${(value / 1000000).toFixed(0)}M`;
                                }
                                return `Rp ${value}`;
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="square"
                            formatter={(value) => (
                                <span className="text-quenza-small font-quenza-medium">
                                    {value === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                                </span>
                            )}
                        />
                        <Bar 
                            dataKey="income" 
                            fill="#20D375" 
                            radius={[8, 8, 0, 0]}
                            name="income"
                        />
                        <Bar 
                            dataKey="expense" 
                            fill="#E22A2A" 
                            radius={[8, 8, 0, 0]}
                            name="expense"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

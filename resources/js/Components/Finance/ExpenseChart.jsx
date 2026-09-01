import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExpenseChart({ data }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-quenza-md shadow-quenza-modal border border-gray-200">
                    <p className="text-quenza-small font-quenza-semibold text-quenza-text-primary">
                        {payload[0].payload.name} 2026
                    </p>
                    <p className="text-quenza-small font-quenza-bold text-red-600 mt-1">
                        Expense: {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="quenza-card rounded-quenza-xl p-6">
            <div className="mb-4">
                <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary">
                    Tren Pengeluaran
                </h3>
                <p className="text-quenza-small text-quenza-text-secondary mt-1">
                    Pola pengeluaran hotel, venue, honor, dan operasional
                </p>
            </div>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        <Bar 
                            dataKey="value" 
                            fill="#E22A2A" 
                            radius={[8, 8, 0, 0]}
                            name="Expense"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

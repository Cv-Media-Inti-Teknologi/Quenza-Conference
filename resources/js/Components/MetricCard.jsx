import React from 'react';

export default function MetricCard({ title, value, change, label, trend, icon }) {
    return (
        <div className="quenza-card quenza-card-hover rounded-quenza-xl flex flex-col justify-between h-32">
            <div className="flex justify-between items-center text-quenza-medium font-quenza-medium text-quenza-text-secondary">
                <span>{title}</span>
                <div className={`w-9 h-9 rounded-quenza-md flex items-center justify-center ${
                    title === 'Kas Keluar' ? 'bg-red-50 text-quenza-danger' :
                    title === 'Kas Masuk' ? 'bg-amber-50 text-amber-600' :
                    title === 'Status Paper' ? 'bg-blue-50 text-blue-600' :
                    'bg-green-50 text-quenza-primary'
                }`}>
                    {icon}
                </div>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary tracking-tight">{value}</h3>
                {change ? (
                    <span className={`text-quenza-small font-quenza-semibold px-2.5 py-0.5 rounded-full ${
                        trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {change}
                    </span>
                ) : (
                    <span className="text-quenza-small text-quenza-text-secondary font-quenza-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}

import React from 'react';

export default function FinanceMetricCard({ title, value, subtitle, icon }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getIconColor = () => {
        switch (icon) {
            case 'income':
                return 'text-emerald-500';
            case 'expense':
                return 'text-red-500';
            case 'balance':
                return 'text-amber-500';
            default:
                return 'text-gray-500';
        }
    };

    const getIconBg = () => {
        switch (icon) {
            case 'income':
                return 'bg-emerald-50';
            case 'expense':
                return 'bg-red-50';
            case 'balance':
                return 'bg-amber-50';
            default:
                return 'bg-gray-50';
        }
    };

    const renderIcon = () => {
        switch (icon) {
            case 'income':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'expense':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                );
            case 'balance':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="quenza-card rounded-quenza-xl p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-quenza-small font-quenza-medium text-quenza-text-secondary mb-2">
                        {title}
                    </p>
                    <h3 className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary mb-1">
                        {formatCurrency(value)}
                    </h3>
                    <p className="text-quenza-small text-quenza-text-secondary font-quenza-regular">
                        {subtitle}
                    </p>
                </div>
                <div className={`${getIconBg()} ${getIconColor()} p-3 rounded-quenza-lg shrink-0`}>
                    {renderIcon()}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function ToastStack() {
    const { flash, errors } = usePage().props;
    const [toasts, setToasts] = useState([]);

    const addToast = (type, title, message) => {
        if (!message) return;
        const id = Date.now() + Math.random().toString(36).substring(2, 7);
        setToasts((prev) => [
            ...prev,
            { id, type, title, message, createdAt: Date.now() }
        ]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // Watch for flash messages from Inertia / Laravel backend
    useEffect(() => {
        if (flash?.success) {
            addToast('success', 'Berhasil', flash.success);
        }
        if (flash?.error) {
            addToast('error', 'Gagal', flash.error);
        }
        if (flash?.info) {
            addToast('info', 'Informasi', flash.info);
        }
        if (flash?.warning) {
            addToast('warning', 'Peringatan', flash.warning);
        }
    }, [flash]);

    // Watch for custom imperative toast events
    useEffect(() => {
        const handleCustomToast = (e) => {
            const { type = 'success', title, message } = e.detail || {};
            const defaultTitle = type === 'success' ? 'Berhasil' : type === 'error' ? 'Gagal' : 'Informasi';
            addToast(type, title || defaultTitle, message);
        };

        window.addEventListener('quenza-toast', handleCustomToast);
        return () => window.removeEventListener('quenza-toast', handleCustomToast);
    }, []);

    // Auto dismiss after 5 seconds
    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setInterval(() => {
            const now = Date.now();
            setToasts((prev) => prev.filter((t) => now - t.createdAt < 5000));
        }, 500);

        return () => clearInterval(timer);
    }, [toasts]);

    if (toasts.length === 0) return null;

    return (
        <div 
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        >
            {toasts.map((toast) => {
                const isSuccess = toast.type === 'success';
                const isError = toast.type === 'error';
                const isWarning = toast.type === 'warning';
                const isInfo = toast.type === 'info';

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto w-full bg-white rounded-2xl p-4 shadow-2xl border transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3.5 relative overflow-hidden ${
                            isSuccess
                                ? 'border-emerald-200/80'
                                : isError
                                ? 'border-red-200/80'
                                : isWarning
                                ? 'border-amber-200/80'
                                : 'border-blue-200/80'
                        }`}
                        role="alert"
                    >
                        {/* Accent Bar Left */}
                        <div 
                            className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                isSuccess 
                                    ? 'bg-emerald-500' 
                                    : isError 
                                    ? 'bg-red-500' 
                                    : isWarning 
                                    ? 'bg-amber-500' 
                                    : 'bg-blue-500'
                            }`} 
                        />

                        {/* Icon Container */}
                        <div 
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-xs ${
                                isSuccess
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    : isError
                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                    : isWarning
                                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}
                        >
                            {isSuccess && '✓'}
                            {isError && '✕'}
                            {isWarning && '⚠️'}
                            {isInfo && 'ℹ'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-4">
                            <h5 
                                className={`text-xs font-bold tracking-tight ${
                                    isSuccess 
                                        ? 'text-emerald-900' 
                                        : isError 
                                        ? 'text-red-900' 
                                        : isWarning 
                                        ? 'text-amber-900' 
                                        : 'text-blue-900'
                                }`}
                            >
                                {toast.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed break-words font-medium">
                                {toast.message}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 w-6 h-6 rounded-md flex items-center justify-center hover:bg-gray-100 transition cursor-pointer text-xs shrink-0"
                            title="Tutup"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

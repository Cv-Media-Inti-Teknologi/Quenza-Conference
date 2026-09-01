import React from 'react';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    type = 'save', // 'save' | 'delete' | 'warning'
    processing = false,
}) {
    if (!isOpen) return null;

    const isDelete = type === 'delete';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div
                className="bg-white rounded-quenza-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-7 flex flex-col gap-5 relative animate-scaleUp"
                role="dialog"
                aria-modal="true"
            >
                {/* Top Icon + Header */}
                <div className="flex items-start gap-4">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                            isDelete
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                    >
                        {isDelete ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-quenza-xlarge font-quenza-bold text-gray-900 leading-snug">
                            {title}
                        </h3>
                        <p className="text-quenza-medium text-gray-600 mt-1.5 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="quenza-btn-outline text-quenza-medium font-quenza-medium px-5 py-2.5 rounded-quenza-md hover:bg-gray-100 border border-gray-300 text-gray-700 transition-colors shadow-2xs"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`px-5 py-2.5 rounded-quenza-md font-quenza-semibold text-quenza-medium transition-all shadow-xs flex items-center justify-center gap-2 ${
                            isDelete
                                ? 'bg-red-600 hover:bg-red-700 text-white hover:brightness-105'
                                : 'quenza-btn-secondary text-white'
                        }`}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Memproses...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

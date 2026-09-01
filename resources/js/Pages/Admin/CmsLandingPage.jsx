import React, { useState, useEffect } from 'react';
import { router, Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import InfoUtamaTab from '../../Components/CMS/InfoUtamaTab';
import ImageSliderTab from '../../Components/CMS/ImageSliderTab';
import SpeakersTab from '../../Components/CMS/SpeakersTab';
import LinimasaTab from '../../Components/CMS/LinimasaTab';
import SponsorTab from '../../Components/CMS/SponsorTab';
import ConfirmationModal from '../../Components/CMS/ConfirmationModal';
import PreviewLandingModal from '../../Components/CMS/PreviewLandingModal';

export default function CmsLandingPage({ landingData }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('info_utama');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' | 'info' }
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteModalState, setDeleteModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        itemType: null,
        index: undefined,
        itemName: '',
        onConfirm: null,
    });

    const formatErrorMessage = (error, status) => {
        switch (status) {
            case 400:
                return 'Permintaan tidak valid (Error 400: Bad Request).';
            case 401:
                return 'Sesi login telah berakhir (Error 401: Unauthorized). Silakan login kembali.';
            case 403:
                return 'Akses ditolak (Error 403: Forbidden). Anda tidak memiliki hak akses untuk menghapus data ini.';
            case 404:
                return 'Data atau endpoint tidak ditemukan di server (Error 404: Not Found).';
            case 419:
                return 'Sesi keamanan kedaluwarsa (Error 419: Page Expired / CSRF Token Mismatch). Silakan muat ulang halaman.';
            case 422:
                return typeof error === 'object' && error !== null
                    ? 'Validasi gagal (Error 422): ' + Object.values(error).flat().join(', ')
                    : 'Format data tidak dapat diproses (Error 422: Unprocessable Entity).';
            case 429:
                return 'Terlalu banyak permintaan (Error 429: Too Many Requests). Harap tunggu beberapa saat.';
            case 500:
                return 'Terjadi kesalahan internal di server (Error 500: Internal Server Error). Gagal menyimpan perubahan.';
            case 502:
                return 'Kesalahan gateway server (Error 502: Bad Gateway).';
            case 503:
                return 'Layanan server sedang dalam pemeliharaan (Error 503: Service Unavailable).';
            case 504:
                return 'Koneksi ke server mengalami batas waktu (Error 504: Gateway Timeout).';
            default:
                if (!navigator.onLine) {
                    return 'Koneksi internet terputus (Network Error). Mohon periksa jaringan Anda.';
                }
                return (typeof error === 'string' && error) || 'Terjadi kesalahan saat memproses permintaan.';
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        const timer = setTimeout(() => {
            setToast((current) => (current?.message === message ? null : current));
        }, 5000);
    };

    const { data, setData, post, processing, errors } = useForm({
        conference_title: landingData?.conference_title || '',
        conference_theme: landingData?.conference_theme || '',
        description: landingData?.description || '',
        date_range: landingData?.date_range || '',
        edition: landingData?.edition || '',
        location: landingData?.location || '',
        slider_images: landingData?.slider_images || [],
        speakers: landingData?.speakers || [],
        important_dates: landingData?.important_dates || [],
        sponsors: landingData?.sponsors || [],
    });

    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        }
        if (flash?.error) {
            showToast(flash.error, 'error');
        }
    }, [flash]);

    // Global listener for HTTP error statuses and network drops
    useEffect(() => {
        const unregisterInvalid = router.on('invalid', (event) => {
            const status = event.detail.response?.status;
            if (status) {
                event.preventDefault();
                showToast(formatErrorMessage(null, status), 'error');
            }
        });

        const unregisterException = router.on('exception', (event) => {
            event.preventDefault();
            showToast('Terjadi kesalahan jaringan atau server tidak merespons. Periksa koneksi Anda.', 'error');
        });

        return () => {
            unregisterInvalid();
            unregisterException();
        };
    }, []);

    const handleSave = (e) => {
        if (e) e.preventDefault();
        post('/admin/cms/update', {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Perubahan berhasil disimpan dan langsung dipublikasikan!', 'success');
                setShowSaveModal(false);
            },
            onError: (errObj) => {
                setShowSaveModal(false);
                const firstErr = Object.values(errObj)?.[0];
                const msg = firstErr ? `Validasi gagal (Error 422): ${firstErr}` : 'Terjadi kesalahan saat menyimpan perubahan.';
                showToast(msg, 'error');
            },
        });
    };

    const handleOpenSaveModal = () => {
        setShowSaveModal(true);
    };

    const handleRequestDelete = ({ itemType, index, itemName, title, message, onConfirm }) => {
        setDeleteModalState({
            isOpen: true,
            itemType,
            index,
            itemName,
            title,
            message,
            onConfirm,
        });
    };

    const handleConfirmDelete = () => {
        const { itemType, index, itemName, onConfirm } = deleteModalState;

        // If itemType and index are provided, automatically delete and persist to backend
        if (itemType && index !== undefined) {
            setIsDeleting(true);
            const currentList = Array.isArray(data[itemType]) ? data[itemType] : [];
            const updatedList = currentList.filter((_, idx) => idx !== index);
            
            const payload = {
                ...data,
                [itemType]: updatedList,
            };

            // Update local form state immediately
            setData(itemType, updatedList);

            // Persist to backend and reload page state
            router.post('/admin/cms/update', payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleting(false);
                    setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
                    showToast(`Data ${itemName ? `"${itemName}"` : ''} berhasil dihapus! Halaman telah diperbarui.`, 'success');
                },
                onError: (errObj) => {
                    setIsDeleting(false);
                    setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
                    const firstErr = Object.values(errObj)?.[0];
                    const msg = firstErr ? `Gagal menghapus (Error 422): ${firstErr}` : 'Gagal memproses penghapusan data.';
                    showToast(msg, 'error');
                },
                onCancel: () => {
                    setIsDeleting(false);
                    setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
                    showToast('Proses penghapusan dibatalkan.', 'info');
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            });
        } else if (onConfirm) {
            onConfirm();
            setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
            showToast('Data berhasil dihapus!', 'success');
        } else {
            setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        }
    };

    // Secure async media upload helper (OWASP A08)
    const handleUploadMedia = async (file, type = 'general') => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);

        // Get CSRF token from document cookie or meta
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return '';
        };

        const csrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
        const metaCsrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        const headers = {
            'Accept': 'application/json',
        };
        if (csrfToken) {
            headers['X-XSRF-TOKEN'] = csrfToken;
        }
        if (metaCsrf) {
            headers['X-CSRF-TOKEN'] = metaCsrf;
        }

        const response = await fetch('/admin/cms/upload', {
            method: 'POST',
            body: formData,
            headers: headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            alert(errorData.error || errorData.message || 'Gagal mengunggah gambar.');
            throw new Error('Upload failed');
        }

        const resJson = await response.json();
        return resJson.url;
    };

    const tabs = [
        { id: 'info_utama', name: 'Info Utama' },
        { id: 'image_slider', name: 'Image Slider' },
        { id: 'speakers', name: 'Featured / Keynote Speakers' },
        { id: 'linimasa', name: 'Important Dates / Linimasa' },
        { id: 'sponsor', name: 'Partner / Sponsor' },
    ];

    return (
        <AdminLayout
            title="CMS Landing Page"
            subtitle="Kelola konten publik landing page konferensi"
        >
            <Head title="CMS Landing Page - Kelola Konten Publik" />

            {/* Floating / Top Toast Notification */}
            {toast && (
                <div
                    className={`px-5 py-4 rounded-quenza-xl flex items-center justify-between shadow-md animate-fadeIn sticky top-20 z-40 border ${
                        toast.type === 'error'
                            ? 'bg-red-50 border-red-300 text-red-900'
                            : toast.type === 'info'
                            ? 'bg-blue-50 border-blue-300 text-blue-900'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-2xs ${
                                toast.type === 'error'
                                    ? 'bg-red-600'
                                    : toast.type === 'info'
                                    ? 'bg-blue-600'
                                    : 'bg-emerald-500'
                            }`}
                        >
                            {toast.type === 'error' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : toast.type === 'info' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p
                                className={`font-quenza-semibold text-quenza-medium ${
                                    toast.type === 'error'
                                        ? 'text-red-900'
                                        : toast.type === 'info'
                                        ? 'text-blue-900'
                                        : 'text-emerald-900'
                                }`}
                            >
                                {toast.type === 'error' ? 'Pemberitahuan Kesalahan' : toast.type === 'info' ? 'Informasi' : 'Berhasil'}
                            </p>
                            <p
                                className={`text-quenza-small mt-0.5 ${
                                    toast.type === 'error'
                                        ? 'text-red-800'
                                        : toast.type === 'info'
                                        ? 'text-blue-800'
                                        : 'text-emerald-800'
                                }`}
                            >
                                {toast.message}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setToast(null)}
                        className={`p-1 rounded-md transition-colors ${
                            toast.type === 'error'
                                ? 'text-red-700 hover:text-red-900'
                                : toast.type === 'info'
                                ? 'text-blue-700 hover:text-blue-900'
                                : 'text-emerald-700 hover:text-emerald-900'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Validation Errors Notice */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-quenza-xl flex items-start gap-3 shadow-xs">
                    <svg className="w-6 h-6 text-quenza-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="font-quenza-semibold text-quenza-medium">Terdapat kesalahan input:</p>
                        <ul className="list-disc list-inside text-quenza-small mt-1 space-y-0.5">
                            {Object.values(errors).map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Main 2-Column Responsive Layout */}
            <div className="flex flex-col md:flex-row items-start gap-8 w-full">
                {/* Left Side: Navigation Pills */}
                <div className="w-full md:w-64 lg:w-72 shrink-0 flex flex-col gap-2.5">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-5 py-3 rounded-full text-quenza-medium transition-all duration-200 flex items-center justify-between ${
                                    isActive
                                        ? 'bg-[#d1fae5] text-[#065f46] font-quenza-semibold shadow-2xs border border-emerald-200/60'
                                        : 'bg-white hover:bg-gray-50 text-gray-700 font-quenza-medium border border-gray-200 shadow-2xs'
                                }`}
                            >
                                <span className="truncate">{tab.name}</span>
                                {isActive && (
                                    <span className="w-2 h-2 rounded-full bg-[#0E5C4A] shrink-0"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Side: Active Tab Form Content */}
                <div className="flex-1 w-full min-w-0">
                    {activeTab === 'info_utama' && (
                        <InfoUtamaTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSave={handleOpenSaveModal}
                            onPreview={() => setShowPreviewModal(true)}
                            processing={processing}
                        />
                    )}

                    {activeTab === 'image_slider' && (
                        <ImageSliderTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSave={handleOpenSaveModal}
                            onPreview={() => setShowPreviewModal(true)}
                            processing={processing}
                            onUploadMedia={handleUploadMedia}
                            onRequestDelete={handleRequestDelete}
                            onNotify={showToast}
                        />
                    )}

                    {activeTab === 'speakers' && (
                        <SpeakersTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSave={handleOpenSaveModal}
                            onPreview={() => setShowPreviewModal(true)}
                            processing={processing}
                            onUploadMedia={handleUploadMedia}
                            onRequestDelete={handleRequestDelete}
                            onNotify={showToast}
                        />
                    )}

                    {activeTab === 'linimasa' && (
                        <LinimasaTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSave={handleOpenSaveModal}
                            onPreview={() => setShowPreviewModal(true)}
                            processing={processing}
                            onRequestDelete={handleRequestDelete}
                            onNotify={showToast}
                        />
                    )}

                    {activeTab === 'sponsor' && (
                        <SponsorTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSave={handleOpenSaveModal}
                            onPreview={() => setShowPreviewModal(true)}
                            processing={processing}
                            onUploadMedia={handleUploadMedia}
                            onRequestDelete={handleRequestDelete}
                            onNotify={showToast}
                        />
                    )}
                </div>
            </div>

            {/* Live Interactive Preview Modal */}
            <PreviewLandingModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                data={data}
            />

            {/* Save Confirmation Modal */}
            <ConfirmationModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={handleSave}
                title="Simpan Perubahan Konten?"
                message="Seluruh konfigurasi konten CMS landing page akan diperbarui dan langsung diterapkan pada halaman publik Quenza Conference."
                confirmText="Ya, Simpan Perubahan"
                cancelText="Batal"
                type="save"
                processing={processing}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalState.isOpen}
                onClose={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDelete}
                title={deleteModalState.title || 'Hapus Data?'}
                message={deleteModalState.message || 'Apakah Anda yakin ingin menghapus item ini?'}
                confirmText="Ya, Hapus Data"
                cancelText="Batal"
                type="delete"
                processing={isDeleting}
            />
        </AdminLayout>
    );
}

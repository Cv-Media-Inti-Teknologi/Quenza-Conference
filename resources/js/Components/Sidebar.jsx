import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';

export default function Sidebar({ sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen, toggleSidebar }) {
    const { url, props } = usePage();
    const user = props.auth?.user || {
        name: 'John Doe',
        role: 'super_admin',
        email: 'admin@quenza.id',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John&backgroundColor=f8c0a8',
    };

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const roleLabel = {
        'super_admin': 'Super Admin',
        'reviewer': 'Reviewer',
        'author': 'Author/Presenter',
        'participant': 'Participant'
    }[user.role] || 'Web Designer';

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        router.post('/logout', {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                setIsLogoutModalOpen(false);
            },
        });
    };

    // Menu list
    const menus = [
        {
            name: 'Dashboard',
            url: '/admin/dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            )
        },
        {
            name: 'Paper & Review',
            url: '#',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        },
        {
            name: 'Event & Penjadwalan',
            url: '/admin/schedule',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
            )
        },
        {
            name: 'Keuangan',
            url: '#',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H4.5A2.25 2.25 0 002.25 12v6.75A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V12zm-9-3a3 3 0 116 0 3 3 0 01-6 0z" />
                </svg>
            )
        },
        {
            name: 'Manajemen Pengguna',
            url: '/admin/users',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            )
        },
        {
            name: 'CMS Landing Page',
            url: '/admin/cms',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            )
        }
    ];

    const handleToggle = () => {
        if (toggleSidebar) {
            toggleSidebar();
        } else if (setSidebarOpen) {
            setSidebarOpen(!sidebarOpen);
        }
    };

    return (
        <>
            <aside
                className={`w-[300px] h-full bg-quenza-sidebar text-white flex flex-col shrink-0 overflow-hidden transition-all duration-300 ease-in-out fixed md:relative top-0 left-0 z-50 md:z-30 ${
                    mobileSidebarOpen ? 'translate-x-0 shadow-2xl h-screen' : '-translate-x-full md:translate-x-0'
                } ${
                    sidebarOpen ? 'md:ml-0 md:opacity-100 md:pointer-events-auto' : 'md:-ml-[300px] md:opacity-0 md:pointer-events-none'
                }`}
            >
                {/* Header: Logo */}
                <div className="px-8 pt-12 pb-10 flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-quenza-2xlarge font-quenza-bold tracking-wide text-white">Quenza</h1>
                        <p className="text-quenza-small tracking-[0.2em] font-mono mt-1 text-white opacity-100">CONFERENCE SYSTEM</p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-5 space-y-2 overflow-y-auto quenza-scrollbar">
                    {menus.map((menu, i) => {
                        const isActive = url === menu.url;
                        return (
                            <Link
                                key={i}
                                href={menu.url}
                                onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
                                className={`flex items-center gap-4 px-4 py-4 rounded-quenza-xl transition-colors ${isActive ? 'bg-quenza-active text-white font-quenza-bold' : 'text-white hover:bg-white/10 hover:text-white font-quenza-regular'}`}
                            >
                                <span className="text-white opacity-100">
                                    {menu.icon}
                                </span>
                                <span className="text-quenza-medium tracking-wide text-white opacity-100">{menu.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile Section */}
                <div className="p-6 mt-4">
                    <div className="bg-quenza-card rounded-quenza-xl p-4 flex items-center justify-between relative group gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10 bg-gray-300">
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-quenza-large font-quenza-semibold text-white tracking-wide truncate">{user.name}</h3>
                                <p className="text-quenza-small font-quenza-regular text-white truncate">{roleLabel}</p>
                            </div>
                        </div>
                        {/* Logout Trigger Button */}
                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="text-white hover:text-red-200 transition-colors focus:outline-none shrink-0 p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                            title="Keluar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
                    <div
                        className="bg-white rounded-quenza-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-7 flex flex-col gap-5 relative text-quenza-text-primary animate-scaleUp"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header with Danger Icon */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border bg-red-50 border-red-200 text-red-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-quenza-xlarge font-quenza-bold text-gray-900 leading-snug">
                                    Konfirmasi Keluar (Logout)
                                </h3>
                                <p className="text-quenza-small text-gray-600 mt-1.5 leading-relaxed">
                                    Apakah Anda yakin ingin keluar dari akun ini? Sesi Anda saat ini akan diakhiri dan Anda akan dialihkan ke halaman login.
                                </p>
                            </div>
                        </div>

                        {/* User preview */}
                        <div className="bg-gray-50/90 rounded-quenza-lg p-3.5 border border-gray-200 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 shrink-0">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-quenza-semibold text-gray-900 truncate text-quenza-medium">{user.name}</h4>
                                <p className="text-quenza-small text-gray-500 truncate">{user.email || 'Akun Aktif'}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsLogoutModalOpen(false)}
                                disabled={isLoggingOut}
                                className="quenza-btn-outline text-quenza-medium font-quenza-medium px-5 py-2.5 rounded-quenza-md hover:bg-gray-100 border border-gray-300 text-gray-700 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                disabled={isLoggingOut}
                                className="bg-quenza-danger hover:bg-red-700 text-white font-quenza-semibold text-quenza-medium px-5 py-2.5 rounded-quenza-md transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Keluar...
                                    </>
                                ) : (
                                    'Ya, Keluar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

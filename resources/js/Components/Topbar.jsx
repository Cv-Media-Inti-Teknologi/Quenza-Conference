import React from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function Topbar({ sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen, toggleSidebar, title, subtitle }) {
    const { props } = usePage();
    const user = props.auth?.user || { name: 'Super Admin' };

    const handleToggle = () => {
        if (toggleSidebar) {
            toggleSidebar();
        } else if (setSidebarOpen) {
            setSidebarOpen(!sidebarOpen);
        }
    };

    return (
        <header className="bg-white/95 backdrop-blur-xs border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-xs">
            <div className="flex items-center gap-4">
                {/* Hamburger Menu */}
                <button
                    type="button"
                    onClick={handleToggle}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors focus:outline-none"
                    title="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <div>
                    <h1 className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary leading-tight">{title}</h1>
                    <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari peserta, paper, transaksi....."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-full text-quenza-medium focus:outline-none focus:border-quenza-primary w-64 bg-quenza-bg font-quenza-regular text-quenza-text-primary"
                    />
                </div>
                {/* Notification */}
                <button className="text-gray-500 hover:text-gray-700 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-quenza-danger rounded-full border border-white"></span>
                </button>
                {/* Profile Link to quickly see identity */}
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        )}
                    </div>
                    <span className="text-quenza-medium font-quenza-semibold text-quenza-text-primary hidden lg:inline">{user.name}</span>
                </div>
            </div>
        </header>
    );
}

import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Topbar from '../Components/Topbar';

export default function AdminLayout({ children, title = 'Dashboard Utama', subtitle = 'Ringkasan operasional & keuangan real-time' }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setMobileSidebarOpen(prev => !prev);
        } else {
            setSidebarOpen(prev => !prev);
        }
    };

    return (
        <div className="bg-quenza-bg text-quenza-text-primary h-screen w-full flex overflow-hidden font-sans antialiased">
            {/* Sidebar */}
            <Sidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen}
                mobileSidebarOpen={mobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
                toggleSidebar={toggleSidebar} 
            />
            
            {/* Overlay for mobile sidebar */}
            {mobileSidebarOpen && (
                <div 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 backdrop-blur-xs"
                    aria-hidden="true"
                />
            )}

            {/* Main Scrollable Content Area */}
            <div className="flex-1 h-screen flex flex-col min-w-0 overflow-y-auto overflow-x-hidden quenza-scrollbar transition-all duration-300 ease-in-out">
                <Topbar 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen}
                    mobileSidebarOpen={mobileSidebarOpen}
                    setMobileSidebarOpen={setMobileSidebarOpen}
                    toggleSidebar={toggleSidebar} 
                    title={title} 
                    subtitle={subtitle} 
                />
                
                <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
                    {children}
                </main>
                
                <footer className="py-6 text-center text-quenza-small font-quenza-regular text-quenza-text-secondary mt-auto">
                    Quenza Conference System - Dasbor Super Admin - ICIT 2026
                </footer>
            </div>
        </div>
    );
}

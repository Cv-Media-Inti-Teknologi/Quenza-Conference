import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Profile({ user, auth }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: user.email || '',
        phone: user.phone || '',
        institution: user.institution || '',
        avatar: null,
    });
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    const handleSave = (e) => {
        e.preventDefault();
        post('/profile', {
            forceFormData: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleCancel = () => {
        reset();
        setAvatarPreview(user.avatar || null);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-quenza-bg text-quenza-text-primary flex flex-col font-sans selection:bg-quenza-primary selection:text-white antialiased">
            <Head title="Profil Saya - Quenza Conference System" />

            {/* Navbar (konsisten dengan Landing Page) */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-quenza-md bg-quenza-secondary flex items-center justify-center text-white shadow-xs">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary tracking-tight">Quenza</span>
                            <span className="text-quenza-small font-mono tracking-widest text-quenza-secondary block uppercase">Conference</span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-quenza-medium font-quenza-medium text-gray-600">
                        <Link href="/#about" className="hover:text-quenza-secondary transition-colors">Tentang</Link>
                        <Link href="/#speakers" className="hover:text-quenza-secondary transition-colors">Pembicara</Link>
                        <Link href="/#timeline" className="hover:text-quenza-secondary transition-colors">Linimasa</Link>
                        <Link href="/#pricing" className="hover:text-quenza-secondary transition-colors">Paket Registrasi</Link>
                        <Link href="/#sponsors" className="hover:text-quenza-secondary transition-colors">Sponsor</Link>
                    </nav>

                    {/* Auth CTA */}
                    <div className="flex items-center gap-3 relative">
                        <Link
                            href="/portal"
                            className="hidden sm:inline-flex quenza-btn-outline text-quenza-medium font-quenza-semibold px-5 py-2.5 rounded-quenza-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Pantau Hasil Paper
                        </Link>

                        <button
                            type="button"
                            onClick={() => setShowUserMenu((prev) => !prev)}
                            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 bg-gray-200 shrink-0">
                                {auth?.user?.avatar ? (
                                    <img src={auth.user.avatar} alt={auth.user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-quenza-bold text-quenza-small">
                                        {auth?.user?.name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <span className="text-quenza-small font-quenza-semibold text-gray-700 hidden sm:inline">
                                {auth?.user?.name}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-quenza-lg border border-gray-200 shadow-lg py-2 z-50">
                                <Link
                                    href="/portal"
                                    className="sm:hidden block px-4 py-2 text-quenza-small text-gray-700 hover:bg-gray-50"
                                >
                                    Pantau Hasil Paper
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-quenza-small text-gray-700 hover:bg-gray-50"
                                >
                                    Profil Saya
                                </Link>
                                {auth?.user?.role === 'super_admin' && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="block px-4 py-2 text-quenza-small text-gray-700 hover:bg-gray-50"
                                    >
                                        Panel Admin
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    onClick={() => router.post('/logout')}
                                    className="w-full text-left px-4 py-2 text-quenza-small text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                    Keluar (Logout)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-quenza-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
                    <h1 className="text-3xl font-quenza-bold text-gray-900 mb-8">Profil Saya</h1>

                    <div className="flex flex-col sm:flex-row gap-8">
                        {/* Avatar */}
                        <div className="shrink-0 flex flex-col items-center">
                            <label
                                htmlFor="avatar-upload"
                                className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 bg-green-100 shadow-sm block ${
                                    isEditing ? 'cursor-pointer group' : ''
                                }`}
                            >
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-quenza-secondary text-4xl font-quenza-bold">
                                        {user.name?.[0] || 'U'}
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                )}
                            </label>

                            {isEditing && (
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            )}

                            {errors.avatar && (
                                <p className="text-quenza-small text-quenza-danger mt-1.5 text-center">{errors.avatar}</p>
                            )}

                            <span className="mt-3 px-3 py-1 rounded-full bg-green-50 text-quenza-secondary text-quenza-small font-quenza-semibold border border-green-200 capitalize">
                                {user.role?.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Fields */}
                        <form onSubmit={handleSave} className="flex-1 space-y-5">
                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                    Nama Pengguna
                                </label>
                                <input
                                    type="text"
                                    value={user.username}
                                    disabled
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-quenza-lg bg-gray-100 text-gray-500 text-quenza-medium cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={!isEditing || processing}
                                    className={`w-full px-4 py-2.5 border rounded-quenza-lg text-quenza-medium transition-all ${
                                        isEditing
                                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-quenza-primary bg-white'
                                            : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    disabled={!isEditing || processing}
                                    className={`w-full px-4 py-2.5 border rounded-quenza-lg text-quenza-medium transition-all ${
                                        isEditing
                                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-quenza-primary bg-white'
                                            : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                    }`}
                                />
                                {errors.phone && (
                                    <p className="text-quenza-small text-quenza-danger mt-1.5">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-quenza-small font-quenza-semibold text-gray-700 mb-1.5">
                                    Institusi / Universitas
                                </label>
                                <input
                                    type="text"
                                    value={data.institution}
                                    onChange={(e) => setData('institution', e.target.value)}
                                    disabled={!isEditing || processing}
                                    className={`w-full px-4 py-2.5 border rounded-quenza-lg text-quenza-medium transition-all ${
                                        isEditing
                                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-quenza-primary bg-white'
                                            : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                    }`}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="quenza-btn-secondary px-6 py-2.5 rounded-quenza-lg font-quenza-semibold text-white cursor-pointer"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="quenza-btn-outline px-6 py-2.5 rounded-quenza-lg font-quenza-semibold border border-gray-300 text-gray-700 cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => router.post('/logout')}
                                            className="bg-quenza-danger hover:bg-red-700 text-white px-6 py-2.5 rounded-quenza-lg font-quenza-semibold transition-all cursor-pointer"
                                        >
                                            Keluar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="quenza-btn-secondary px-6 py-2.5 rounded-quenza-lg font-quenza-semibold text-white cursor-pointer"
                                        >
                                            Edit Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
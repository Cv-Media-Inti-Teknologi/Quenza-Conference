import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="bg-quenza-bg flex items-center justify-center min-h-screen p-4 font-sans">
            <Head title="Masuk" />

            {/* Main Card Container */}
            <div className="bg-white rounded-quenza-2xl shadow-quenza-modal flex flex-col md:flex-row w-full max-w-4xl overflow-hidden min-h-[550px] border border-gray-100">

                {/* Left Panel: Illustration */}
                <div className="bg-quenza-light w-full md:w-1/2 p-10 flex flex-col items-center pt-24 relative justify-center">
                    <h2 className="text-quenza-3xlarge font-quenza-bold text-quenza-text-primary mb-12 font-serif tracking-wide">Selamat Datang</h2>
                    
                    {/* Illustration Area */}
                    <div className="w-full max-w-[280px] flex justify-center">
                        <div className="w-64 h-64 border-2 border-dashed border-quenza-secondary rounded-quenza-xl flex items-center justify-center text-quenza-secondary font-quenza-medium bg-white/30 backdrop-blur-sm">
                            <span className="text-center px-4 font-mono uppercase tracking-wider text-quenza-small">[Quenza Conference System]</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Login Form */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
                    <form onSubmit={handleSubmit} className="w-full max-w-[320px] mx-auto">
                        {/* Heading */}
                        <div className="mb-8">
                            <h3 className="text-quenza-xlarge font-quenza-bold text-quenza-text-primary">Akses Panitia</h3>
                            <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-1">Masukkan nama pengguna dan kata sandi Anda</p>
                        </div>

                        {/* Input Nama Pengguna */}
                        <div className="mb-6">
                            <label htmlFor="username" className="block text-quenza-medium font-quenza-medium text-gray-800 mb-2">Nama Pengguna</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="Masukkan Nama Pengguna" 
                                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium placeholder-gray-400 text-quenza-text-primary transition-all"
                                disabled={processing}
                            />
                            {errors.username && (
                                <p className="text-quenza-small font-quenza-regular text-quenza-danger mt-1.5 px-3">{errors.username}</p>
                            )}
                        </div>

                        {/* Input Kata Sandi */}
                        <div className="mb-10">
                            <label htmlFor="password" className="block text-quenza-medium font-quenza-medium text-gray-800 mb-2">Kata Sandi</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    id="password" 
                                    name="password" 
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan Kata Sandi" 
                                    className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-quenza-primary focus:border-transparent text-quenza-medium pr-12 placeholder-gray-400 text-quenza-text-primary transition-all"
                                    disabled={processing}
                                />
                                
                                {/* Toggle Show/Hide Password Icon */}
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-quenza-small font-quenza-regular text-quenza-danger mt-1.5 px-3">{errors.password}</p>
                            )}
                        </div>

                        {/* Tombol Masuk */}
                        <button 
                            type="submit" 
                            className="w-full bg-quenza-secondary hover:bg-quenza-active text-white font-quenza-semibold py-3 px-4 rounded-full transition-all duration-200 text-quenza-large flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none"
                            disabled={processing}
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

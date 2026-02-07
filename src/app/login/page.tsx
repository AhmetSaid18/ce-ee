'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getApiUrl } from '@/lib/api-config';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Backend login endpoint'ini de tenant yapısına uygun varsayıyoruz
            const response = await fetch(getApiUrl('/users/login/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Token'ı kaydet ve yönlendir - backend 'token' veya 'access' dönebilir
                const token = data.token || data.access;
                if (token) {
                    localStorage.setItem('auth_token', token);
                    if (data.user) {
                        localStorage.setItem('user_info', JSON.stringify(data.user));
                    }

                    // Diğer componentleri (Navbar vb.) haberdar et
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new Event('login'));

                    router.push('/hesabim');
                    router.refresh();
                } else {
                    setError('Sunucudan geçersiz yanıt alındı.');
                }
            } else {
                setError(data.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
            }
        } catch (err) {
            setError('Bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 relative">
                <Link
                    href="/"
                    className="absolute top-8 left-8 text-primary-blue hover:text-primary-orange transition-colors flex items-center gap-2 font-bold text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Ana Sayfa
                </Link>

                <div className="text-center mb-10 pt-4">
                    <h1 className="text-3xl font-bold text-primary-blue mb-2">Hoş Geldin</h1>
                    <p className="text-text-muted">Hesabına giriş yap ve eğlenceye başla!</p>
                </div>

                {registered && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6 text-sm font-medium text-center">
                        Kayıt başarıyla tamamlandı! Şimdi giriş yapabilirsin.
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-primary-blue mb-2 ml-2">E-posta</label>
                        <input
                            type="email"
                            required
                            className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all"
                            placeholder="E-posta adresin"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-primary-blue mb-2 ml-2">Şifre</label>
                        <input
                            type="password"
                            required
                            className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary text-lg py-4"
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <p className="text-center mt-8 text-text-muted">
                    Henüz hesabın yok mu?{' '}
                    <Link href="/register" className="text-primary-orange font-bold hover:underline">
                        Hemen Kayıt Ol
                    </Link>
                </p>
            </div>
        </div>
    );
}

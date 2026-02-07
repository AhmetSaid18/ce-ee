'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api-config';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [verifyCode, setVerifyCode] = useState('');
    const [showVerify, setShowVerify] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(getApiUrl('/users/register/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowVerify(true);
                setSuccessMsg('Kayıt başarılı! E-posta adresine bir doğrulama kodu gönderdik.');
            } else {
                setError(data.message || 'Kayıt sırasında bir hata oluştu.');
            }
        } catch (err) {
            setError('Bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(getApiUrl('/users/verify/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    code: verifyCode
                }),
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
                setError(data.message || 'Doğrulama kodu hatalı veya süresi dolmuş.');
            }
        } catch (err) {
            setError('Bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const response = await fetch(getApiUrl('/users/send-code/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            if (response.ok) {
                setSuccessMsg('Doğrulama kodu tekrar gönderildi.');
            } else {
                setError('Kod gönderilemedi. Lütfen tekrar deneyin.');
            }
        } catch (err) {
            setError('Bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-blue/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                <Link
                    href="/"
                    className="absolute top-8 left-8 text-primary-blue hover:text-primary-orange transition-colors flex items-center gap-2 font-bold text-sm z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Ana Sayfa
                </Link>

                {!showVerify ? (
                    <>
                        <div className="text-center mb-10 pt-4 relative z-10">
                            <h1 className="text-3xl font-bold text-primary-blue mb-2">Aramıza Katıl</h1>
                            <p className="text-text-muted">CE-EE dünyasına hoş geldin!</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-primary-blue mb-2 ml-2">Ad</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all"
                                        placeholder="Jane"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-primary-blue mb-2 ml-2">Soyad</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all"
                                        placeholder="Smith"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-primary-blue mb-2 ml-2">E-posta</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all"
                                    placeholder="altinbasr271@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-primary-blue mb-2 ml-2">Telefon</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-orange transition-all"
                                    placeholder="+90 555..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                                className="w-full btn-primary text-lg mt-6 py-4 shadow-lg shadow-primary-orange/20"
                            >
                                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-text-muted relative z-10">
                            Zaten hesabın var mı?{' '}
                            <Link href="/login" className="text-primary-orange font-bold hover:underline">
                                Giriş Yap
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-10 pt-4 relative z-10">
                            <div className="w-20 h-20 bg-orange-50 text-primary-orange rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                            </div>
                            <h1 className="text-3xl font-bold text-primary-blue mb-2">E-postanı Doğrula</h1>
                            <p className="text-text-muted px-4">
                                <span className="font-bold text-primary-blue">{formData.email}</span> adresine gönderdiğimiz 6 haneli kodu gir.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-green-100">
                                {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-6 relative z-10">
                            <div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="w-full px-6 py-5 bg-light-bg rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-orange text-center text-3xl font-black tracking-[0.5em] text-primary-blue placeholder:text-gray-200 transition-all"
                                    placeholder="000000"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || verifyCode.length < 6}
                                className="w-full btn-primary text-lg py-4 shadow-lg shadow-primary-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Doğrulanıyor...' : 'Hesabı Doğrula'}
                            </button>
                        </form>

                        <div className="text-center mt-8 space-y-4 relative z-10">
                            <p className="text-text-muted">
                                Kod gelmedi mi?{' '}
                                <button
                                    onClick={handleResendCode}
                                    disabled={loading}
                                    className="text-primary-orange font-bold hover:underline disabled:opacity-50"
                                >
                                    Tekrar Gönder
                                </button>
                            </p>
                            <button
                                onClick={() => setShowVerify(false)}
                                className="text-sm font-bold text-primary-blue/60 hover:text-primary-blue transition-colors"
                            >
                                Bilgileri Düzenle
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


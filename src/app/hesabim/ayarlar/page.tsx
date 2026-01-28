'use client';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary-blue">Hesap Ayarları</h1>

            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm max-w-2xl">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-primary-blue mb-2">Ad</label>
                            <input className="w-full px-6 py-4 bg-light-bg rounded-2xl outline-none" placeholder="Adınız" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-primary-blue mb-2">Soyad</label>
                            <input className="w-full px-6 py-4 bg-light-bg rounded-2xl outline-none" placeholder="Soyadınız" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary-blue mb-2">E-posta</label>
                        <input className="w-full px-6 py-4 bg-light-bg rounded-2xl outline-none" type="email" placeholder="E-posta adresiniz" />
                    </div>

                    <div className="pt-4">
                        <h3 className="text-xl font-bold text-primary-blue mb-6">Şifre Değiştir</h3>
                        <div className="space-y-4">
                            <input className="w-full px-6 py-4 bg-light-bg rounded-2xl outline-none" type="password" placeholder="Mevcut Şifre" />
                            <input className="w-full px-6 py-4 bg-light-bg rounded-2xl outline-none" type="password" placeholder="Yeni Şifre" />
                            <input className="w-full px-6 py-4 bg-light-bg rounded-2xl outline-none" type="password" placeholder="Yeni Şifre (Tekrar)" />
                        </div>
                    </div>

                    <button type="button" className="btn-primary w-full py-4 text-lg mt-4">Değişiklikleri Kaydet</button>
                </form>
            </div>
        </div>
    );
}

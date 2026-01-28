'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPublicApiUrl, getBaseHeaders } from '@/lib/api-config';
import { useState } from 'react';

const features = [
    {
        title: "Kolay İade",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
        ),
        color: "bg-blue-50 text-blue-500"
    },
    {
        title: "Değişim Garantisi",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        ),
        color: "bg-pink-50 text-pink-500"
    },
    {
        title: "Hızlı Teslimat",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ),
        color: "bg-orange-50 text-orange-500"
    },
    {
        title: "Müşteri Desteği",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ),
        color: "bg-purple-50 text-purple-500"
    }
];

const Features = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleInspectProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(getPublicApiUrl('/products/'), {
                headers: getBaseHeaders()
            });
            const data = await res.json();

            if (data.results && data.results.length === 1) {
                const slug = data.results[0].slug;
                router.push(`/magaza/${slug}`);
            } else {
                router.push('/magaza');
            }
        } catch (err) {
            console.error('Ürün yüklenemedi:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card group">
                            <div className={`w-20 h-20 mx-auto rounded-3xl ${feature.color} flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary-blue">{feature.title}</h3>
                        </div>
                    ))}
                </div>

                <div className="mt-40 grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
                        <Image
                            src="/baby-playing.png"
                            alt="Eğlenceli Hediye"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <span className="text-primary-orange font-bold uppercase tracking-widest text-sm mb-4 block">
                            KARŞINIZDA CE-EE
                        </span>
                        <h2 className="text-5xl font-bold text-primary-blue mb-8 leading-tight">
                            Eğlenceli bir hediye
                        </h2>
                        <p className="text-xl text-text-muted leading-relaxed mb-10">
                            Tamamen minik dostlarımızın eğlenmesi için geliştirilen CE-EE Ayıcık, Türkçe konuşarak onlarla iletişim kuruyor.
                            Ses kaydı özelliğini kullanarak çocuğunuza eğitici içerikler geliştirebilirsiniz.
                        </p>
                        <button
                            onClick={handleInspectProduct}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Yükleniyor...' : 'Ürünü İncele'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;

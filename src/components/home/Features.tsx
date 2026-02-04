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
        gradient: "from-blue-400 to-blue-600"
    },
    {
        title: "Değişim Garantisi",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        ),
        gradient: "from-pink-400 to-pink-600"
    },
    {
        title: "Hızlı Teslimat",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ),
        gradient: "from-orange-400 to-orange-600"
    },
    {
        title: "Müşteri Desteği",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ),
        gradient: "from-purple-400 to-purple-600"
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
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #232E52 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card card-hover group opacity-0 animate-fadeInUp stagger-${index + 1}`}
                            style={{ animationFillMode: 'forwards' }}
                        >
                            <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg text-white`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary-blue group-hover:gradient-text-blue transition-all duration-300">{feature.title}</h3>
                        </div>
                    ))}
                </div>

                <div className="mt-40 grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        {/* Decorative frame elements */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-primary-orange via-secondary-pink to-secondary-blue rounded-[50px] opacity-30 blur-sm animate-pulse-subtle"></div>
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary-orange via-secondary-pink to-secondary-blue rounded-[45px] opacity-50"></div>

                        {/* Corner decorations */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary-orange rounded-full shadow-lg flex items-center justify-center z-20">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-secondary-blue rounded-full shadow-lg flex items-center justify-center z-20">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        {/* Main image container */}
                        <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl group bg-white p-1">
                            <div className="absolute inset-0 rounded-[38px] overflow-hidden">
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Image
                                    src="/baby-playing.png"
                                    alt="Eğlenceli Hediye"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <span className="inline-flex items-center gap-2 text-primary-orange font-bold uppercase tracking-widest text-sm mb-4 px-4 py-2 bg-orange-50 rounded-full">
                            <span className="w-2 h-2 bg-primary-orange rounded-full animate-pulse"></span>
                            KARŞINIZDA CE-EE
                        </span>
                        <h2 className="text-5xl font-bold text-primary-blue mb-8 leading-tight">
                            Eğlenceli bir <span className="gradient-text">hediye</span>
                        </h2>
                        <p className="text-xl text-text-muted leading-relaxed mb-10">
                            Tamamen minik dostlarımızın eğlenmesi için geliştirilen CE-EE Ayıcık, Türkçe konuşarak onlarla iletişim kuruyor.
                            Ses kaydı özelliğini kullanarak çocuğunuza eğitici içerikler geliştirebilirsiniz.
                        </p>
                        <button
                            onClick={handleInspectProduct}
                            disabled={loading}
                            className="btn-primary btn-premium group"
                        >
                            <span className="flex items-center gap-2">
                                {loading ? 'Yükleniyor...' : 'Ürünü İncele'}
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;

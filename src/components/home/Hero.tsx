'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPublicApiUrl, getBaseHeaders } from '@/lib/api-config';
import { useState } from 'react';

const Hero = () => {
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
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden hero-gradient text-primary-blue">
            {/* Animated Blob Decorations */}
            <div className="absolute top-20 left-[5%] w-72 h-72 bg-secondary-pink/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-secondary-blue/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-yellow/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>

            {/* Decorative Clouds */}
            <div className="absolute top-20 left-[10%] opacity-70 animate-float" style={{ animationDelay: '0s' }}>
                <svg width="120" height="80" viewBox="0 0 120 80" fill="white" className="drop-shadow-lg"><circle cx="40" cy="40" r="30" /><circle cx="70" cy="40" r="40" /><circle cx="100" cy="40" r="25" /></svg>
            </div>
            <div className="absolute top-40 right-[15%] opacity-50 animate-float" style={{ animationDelay: '2s' }}>
                <svg width="150" height="100" viewBox="0 0 150 100" fill="white" className="drop-shadow-lg"><circle cx="50" cy="50" r="35" /><circle cx="90" cy="50" r="45" /><circle cx="130" cy="50" r="30" /></svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left side: Images */}
                    <div className="relative order-2 md:order-1 h-[500px] flex items-center justify-center">
                        {/* Outer decorative ring */}
                        <div className="absolute w-[380px] h-[380px] rounded-full border-4 border-dashed border-primary-orange/30 animate-spin" style={{ animationDuration: '30s' }}></div>

                        {/* Blob background shape */}
                        <div className="absolute w-[320px] h-[320px] bg-gradient-to-br from-white via-secondary-pink/20 to-secondary-blue/20 animate-blob shadow-2xl" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>

                        {/* Inner gradient border */}
                        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-primary-orange via-secondary-pink to-secondary-blue p-1">
                            <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm"></div>
                        </div>

                        {/* Main image container */}
                        <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden shadow-2xl animate-float z-10">
                            <Image
                                src="/hero-bear.png"
                                alt="Ce-ee Ayıcık"
                                fill
                                className="object-cover scale-125"
                                priority
                            />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-primary-orange rounded-full shadow-lg flex items-center justify-center z-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-secondary-blue rounded-full shadow-lg flex items-center justify-center z-20 animate-bounce" style={{ animationDelay: '1s' }}>
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        <div className="absolute top-1/2 -right-8 w-10 h-10 bg-secondary-pink rounded-full shadow-lg flex items-center justify-center z-20 animate-pulse">
                            <span className="text-white text-lg">✨</span>
                        </div>

                        <div className="absolute top-10 -left-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg flex items-center justify-center z-20 animate-float" style={{ animationDelay: '2s' }}>
                            <span className="text-white text-xl">🎵</span>
                        </div>

                        {/* Small floating dots */}
                        <div className="absolute top-0 left-1/4 w-4 h-4 bg-primary-orange rounded-full animate-ping opacity-60"></div>
                        <div className="absolute bottom-10 right-0 w-3 h-3 bg-secondary-pink rounded-full animate-ping opacity-80" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Right side: Content */}
                    <div className="order-1 md:order-2 text-center md:text-left animate-fadeInUp">
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg border border-white/50 animate-glowPulse">
                            <span className="text-lg">🎉</span> Yeni Nesil Arkadaş
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-shadow-lg">
                            Lansmana <span className="gradient-text">Özel</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-lg leading-relaxed">
                            Herkes CE-EE ile tanışsın diye lansmana özel sadece <span className="font-bold text-primary-orange text-2xl md:text-3xl">1490₺</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={handleInspectProduct}
                                disabled={loading}
                                className="btn-primary btn-premium text-xl glow-orange"
                            >
                                {loading ? 'Yükleniyor...' : 'Hemen Satın Al'}
                            </button>
                            <button
                                onClick={handleInspectProduct}
                                className="px-8 py-3 rounded-full border-2 border-primary-blue text-primary-blue font-bold hover:bg-primary-blue hover:text-white transition-all duration-300 hover:shadow-xl hover:scale-105"
                            >
                                Detayları Gör
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave bottom decoration */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#FFFFFF"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;

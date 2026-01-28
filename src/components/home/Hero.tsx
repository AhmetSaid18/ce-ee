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
            // Even if API fails, we can try a default slug or stay home
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden hero-gradient text-primary-blue">
            {/* Decorative Clouds */}
            <div className="absolute top-20 left-[10%] opacity-60 animate-float" style={{ animationDelay: '0s' }}>
                <svg width="120" height="80" viewBox="0 0 120 80" fill="white"><circle cx="40" cy="40" r="30" /><circle cx="70" cy="40" r="40" /><circle cx="100" cy="40" r="25" /></svg>
            </div>
            <div className="absolute top-40 right-[15%] opacity-40 animate-float" style={{ animationDelay: '2s' }}>
                <svg width="150" height="100" viewBox="0 0 150 100" fill="white"><circle cx="50" cy="50" r="35" /><circle cx="90" cy="50" r="45" /><circle cx="130" cy="50" r="30" /></svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left side: Images */}
                    <div className="relative order-2 md:order-1 h-[400px] flex items-center justify-center">
                        <div className="relative w-3/4 h-3/4 animate-float">
                            <Image
                                src="/hero-bear.png"
                                alt="Ce-ee Ayıcık"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        {/* Playful elements around the bear */}
                        <div className="absolute bottom-10 left-10 w-24 h-24 bg-secondary-blue/20 rounded-full blur-xl -z-10 animate-float"></div>
                        <div className="absolute top-20 right-10 w-32 h-32 bg-secondary-pink/20 rounded-full blur-2xl -z-10 animate-float" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Right side: Content */}
                    <div className="order-1 md:order-2 text-center md:text-left">
                        <span className="inline-block px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                            🎉 Yeni Nesil Arkadaş
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                            Lansmana <span className="text-primary-orange">Özel</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-lg">
                            Herkes CE-EE ile tanışsın diye lansmana özel sadece <span className="font-bold text-primary-blue">1490₺</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={handleInspectProduct}
                                disabled={loading}
                                className="btn-primary text-xl"
                            >
                                {loading ? 'Yükleniyor...' : 'Hemen Satın Al'}
                            </button>
                            <button
                                onClick={handleInspectProduct}
                                className="px-8 py-3 rounded-full border-2 border-primary-blue text-primary-blue font-bold hover:bg-primary-blue hover:text-white transition-all duration-300"
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

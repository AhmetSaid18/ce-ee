'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPublicApiUrl, getBaseHeaders } from '@/lib/api-config';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const testimonials = [
    {
        name: "Adem Ziya Akyurt",
        location: "Antalya",
        text: "Oğluma amcasından ilk doğum günü hediyesi olarak geldi. Telefonun peşini bıraktı çocuk. Ayı çok güzel arkadaşlar gürültüsü de çekilebilir makuliyette :))",
        rating: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adem"
    },
    {
        name: "Emine Doğan",
        location: "İstanbul",
        text: "Kızım bu tatlı ayıcıkla çok eğleniyor. Satın alırken biraz fiyatın yüksek olduğunu düşünmüştüm ama yemek yedirirken çok fonksiyonel oldu doğrusu.",
        rating: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emine"
    },
    {
        name: "Mehmet Yılmaz",
        location: "Ankara",
        text: "Torunum elinden düşürmüyor. Konuşması ve ses kalitesi beklediğimden çok daha iyi. Kesinlikle tavsiye ederim.",
        rating: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet"
    },
    {
        name: "Selin Demir",
        location: "İzmir",
        text: "Hediye paketi ve notu çok şıktı. Ürün kalitesi zaten tartışılmaz. Teşekkürler CE-EE ekibi!",
        rating: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selin"
    }
];

const Testimonials = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleOrderClick = async () => {
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
            console.error('Yükleme hatası:', err);
            router.push('/magaza');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 testimonial-bg relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-40 right-40 w-80 h-80 border-8 border-secondary-pink rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    {/* Left Side Content */}
                    <div className="lg:col-span-4 text-white text-center lg:text-left mb-10 lg:mb-0">
                        <span className="text-secondary-blue font-bold tracking-widest text-sm uppercase mb-4 block">
                            Sizden Gelenler
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                            CE-EE ile Mutlu Bebekler
                        </h2>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                            <button
                                onClick={handleOrderClick}
                                disabled={loading}
                                className="btn-cyan text-lg px-10"
                            >
                                {loading ? 'Yükleniyor...' : 'Sipariş Ver'}
                            </button>
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-white/60 text-sm mt-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-primary-orange" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span>+500 Mutlu Müşteri</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Slider */}
                    <div className="lg:col-span-8 w-full group">
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                            }}
                            className="testimonial-swiper pb-16"
                        >
                            {testimonials.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-white rounded-[40px] p-10 h-full shadow-2xl flex flex-col transform transition-transform duration-500 hover:scale-[0.98]">
                                        <div className="text-secondary-pink mb-8">
                                            <svg width="45" height="35" viewBox="0 0 40 30" fill="currentColor">
                                                <path d="M11.1111 0L15.5556 4.44444V15.5556H0V0H11.1111ZM35.5556 0L40 4.44444V15.5556H24.4444V0H35.5556Z" />
                                            </svg>
                                        </div>

                                        <p className="text-primary-blue/80 text-xl leading-relaxed mb-10 flex-grow">
                                            "{item.text}"
                                        </p>

                                        <div className="flex items-center gap-5 border-t border-gray-100 pt-8">
                                            <div className="relative w-16 h-16 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-primary-dark text-lg leading-tight">{item.name}</h4>
                                                <p className="text-primary-blue/50 text-sm mb-1">{item.location}</p>
                                                <div className="flex text-primary-orange">
                                                    {[...Array(item.rating)].map((_, i) => (
                                                        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <style jsx global>{`
              .testimonial-swiper .swiper-pagination-bullet {
                background: white !important;
                opacity: 0.3;
                width: 12px;
                height: 12px;
                transition: all 0.3s ease;
              }
              .testimonial-swiper .swiper-pagination-bullet-active {
                opacity: 1;
                width: 30px;
                border-radius: 6px;
                background: #00ADEF !important;
              }
            `}</style>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPublicApiUrl, getBaseHeaders } from '@/lib/api-config';
import { useCart } from '@/context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export default function ProductDetail({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('desc');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(getPublicApiUrl(`/products/urun/${params.slug}/`), {
                    headers: getBaseHeaders()
                });
                const data = await res.json();

                if (data.success && data.product) {
                    setProduct(data.product);
                } else {
                    // Fallback dummy for demo if API fails
                    setProduct({
                        name: "Ce-ee Ayıcık",
                        price: "1490.00",
                        compare_at_price: "2190.00",
                        description_html: "<p>CE-EE Oyun Arkadaşı, 0+ bebekler için eğlenceli ve öğretici bir oyuncaktır. Avrupa Birliği güvenlik standartlarına uygun olarak üretilmiş olan bu oyuncak, yumuşak peluş malzemeden yapılmıştır ve Türkçe konuşma ve ses taklit özelliklerine sahiptir.</p>",
                        category_names: ["Ce-ee Ayıcık"],
                        id: "41cc0a45-cca7-44cd-b01b-bbdf9824b7ce",
                        images: [
                            { image_url: "/hero-bear.png" },
                            { image_url: "/hero-bear.png" },
                            { image_url: "/hero-bear.png" }
                        ]
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Ürün bulunamadı.</div>;

    // Helper to get image URLs
    const imageUrls = product.images?.length > 0
        ? product.images.map((img: any) => img.image_url)
        : [product.primary_image || '/hero-bear.png'];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-16">

                    {/* Left Side: Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-[#F9F9F9] rounded-[32px] overflow-hidden group">
                            <Swiper
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="h-full w-full"
                            >
                                {imageUrls.map((img: string, idx: number) => (
                                    <SwiperSlide key={idx} className="flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-primary-orange transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={16}
                            slidesPerView={Math.min(4, imageUrls.length)}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="thumbs-swiper"
                        >
                            {imageUrls.map((img: string, idx: number) => (
                                <SwiperSlide key={idx} className="cursor-pointer border-2 border-transparent rounded-2xl overflow-hidden hover:border-secondary-blue transition-all bg-[#F9F9F9] aspect-square">
                                    <div className="relative w-full h-full">
                                        <Image src={img} alt="thumbnail" fill className="object-cover" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Right Side: Product Details */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="bg-secondary-blue text-white px-3 py-1 rounded-lg text-sm font-bold">
                                Favori Ürün
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-primary-blue mb-6">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            {product.compare_at_price && (
                                <span className="text-2xl text-gray-300 line-through font-medium">
                                    {product.compare_at_price}₺
                                </span>
                            )}
                            <span className="text-4xl font-bold text-secondary-blue">
                                {product.price}₺
                            </span>
                            <span className="text-lg font-bold text-primary-blue/30">
                                KDV
                            </span>
                            <div className="flex text-primary-orange ml-auto">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-gray-100 mb-8">
                            <button
                                onClick={() => setActiveTab('desc')}
                                className={`pb-4 px-6 text-lg font-bold transition-all relative ${activeTab === 'desc' ? 'text-secondary-blue' : 'text-primary-blue/40'}`}
                            >
                                Açıklama
                                {activeTab === 'desc' && <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary-blue rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`pb-4 px-6 text-lg font-bold transition-all relative ${activeTab === 'specs' ? 'text-secondary-blue' : 'text-primary-blue/40'}`}
                            >
                                Teknik Özellikler
                                {activeTab === 'specs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary-blue rounded-t-full" />}
                            </button>
                        </div>

                        {/* Tabs Content */}
                        <div className="mb-10 min-h-[150px]">
                            {activeTab === 'desc' ? (
                                <div
                                    className="text-lg text-text-muted leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: product.description_html || product.description || "CE-EE ile oyun vakti çok daha eğlenceli!" }}
                                />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.specifications?.map((spec: any, idx: number) => (
                                        <div key={idx} className="flex flex-col p-4 bg-[#F9F9F9] rounded-2xl">
                                            <span className="text-sm font-bold text-primary-blue/40 uppercase tracking-wider">{spec.key}</span>
                                            <span className="text-lg font-bold text-primary-blue">{spec.value}</span>
                                        </div>
                                    ))}
                                    {(!product.specifications || product.specifications.length === 0) && (
                                        <p className="text-text-muted">Bu ürün için teknik özellik belirtilmemiş.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 mb-12">
                            <button
                                onClick={async () => {
                                    if (!product) return;
                                    const success = await addToCart(product.id, quantity, undefined, product);
                                    if (success) router.push('/sepet');
                                }}
                                className="btn-cyan h-16 px-8 sm:px-12 text-lg sm:text-xl shadow-xl hover:shadow-cyan-500/20 flex-1 whitespace-nowrap"
                            >
                                Hemen Al
                            </button>

                            <button
                                onClick={async () => {
                                    if (!product) return;
                                    await addToCart(product.id, quantity, undefined, product);
                                    alert('Ürün sepete eklendi!');
                                }}
                                className="h-16 w-16 bg-secondary-blue text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary-blue transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                            </button>

                            <div className="flex items-center bg-[#F9F9F9] rounded-2xl h-16 px-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary-blue transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="12" x2="6" y2="12"></line></svg>
                                </button>
                                <span className="w-12 text-center font-bold text-xl text-primary-blue">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary-blue transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            </div>

                            <button className="w-16 h-16 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>
                        </div>

                        <div className="space-y-3 pt-8 mt-auto border-t border-gray-100">
                            <div className="flex items-center gap-3 text-text-muted">
                                <svg className="w-5 h-5 text-secondary-blue animate-pulse" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="5" /></svg>
                                <span>Bu ürünü şu an: <span className="font-bold text-primary-blue">13 kişi</span> inceliyor.</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-primary-blue">Category:</span> <span className="text-text-muted">{product.category_names?.[0] || 'Oyuncak'}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-primary-blue">Product ID:</span> <span className="text-text-muted">{product.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
        .thumbs-swiper .swiper-slide-thumb-active {
          border-color: #86C5F1 !important;
        }
        .swiper-button-next, .swiper-button-prev {
          color: #232E52;
          background: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
        </main>
    );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getStorefrontApiUrl, getBaseHeaders } from '@/lib/api-config';
import { useCart } from '@/context/CartContext';

export default function StorePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Yeni Storefront API
                const res = await fetch(getStorefrontApiUrl('/products'), {
                    headers: getBaseHeaders()
                });
                const data = await res.json();

                if (data.items) {
                    setProducts(data.items);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse space-y-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">Tüm Ürünler</h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Miniklerin gelişimine katkı sağlayan, eğlenceli ve öğretici ürünlerimizi keşfedin.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-text-muted">Henüz ürün bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100">
                                <Link href={`/magaza/${product.slug}`} className="block relative aspect-square bg-[#F9F9F9] overflow-hidden">
                                    <Image
                                        src={product.images?.[0]?.url || '/hero-bear.png'}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                            İndirim
                                        </div>
                                    )}
                                </Link>

                                <div className="p-8">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-primary-blue mb-2 group-hover:text-primary-orange transition-colors">
                                            <Link href={`/magaza/${product.slug}`}>
                                                {product.title}
                                            </Link>
                                        </h3>
                                        {/* Kategori adı varsa safe access ile alalım */}
                                        <p className="text-text-muted line-clamp-2 text-sm">
                                            {product.shortDescription || product.category?.name || 'Eğlenceli ve öğretici arkadaş.'}
                                        </p>
                                    </div>

                                    <div className="flex items-end justify-between gap-4">
                                        <div className="flex flex-col">
                                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                <span className="text-sm text-gray-400 line-through font-medium">
                                                    {product.compareAtPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {product.currency}
                                                </span>
                                            )}
                                            <span className="text-2xl font-bold text-secondary-blue">
                                                {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {product.currency}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const pInfo = {
                                                    name: product.title,
                                                    price: product.price,
                                                    primary_image: product.images?.[0]?.url
                                                };
                                                addToCart(product.id, 1, null, pInfo);
                                            }}
                                            className="bg-[#00ADEF] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-[#0096d1] hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                                            Sepete Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

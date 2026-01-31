'use client';

import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, loading, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();

    if (loading && !cart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const isEmpty = !cart || !cart.items || cart.items.length === 0;

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <h1 className="text-4xl font-bold text-primary-blue mb-8">Sepetim</h1>

                {isEmpty ? (
                    <div className="bg-white rounded-[40px] p-12 text-center shadow-lg border border-gray-100">
                        <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-orange"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-primary-blue mb-4">Sepetin şu an boş</h2>
                        <p className="text-text-muted mb-8 text-lg">Hemen alışverişe başla ve sepetini doldur!</p>
                        <Link href="/magaza" className="btn-primary px-12 py-4 text-lg inline-flex items-center gap-2">
                            Alışverişe Başla
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart!.items.map((item) => (
                                <div key={item.id} className="bg-white rounded-[32px] p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden">
                                        <Image
                                            src={item.image_url || '/hero-bear.png'}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-primary-blue mb-1">{item.product_name}</h3>
                                            <p className="text-sm text-text-muted mb-4">
                                                {item.variant_name ? `Varyant: ${item.variant_name}` : ''}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    Sepetten Sil
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between">
                                            <h4 className="text-xl font-bold text-secondary-blue mb-4">
                                                {item.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {cart?.currency || 'TRY'}
                                            </h4>

                                            <div className="flex items-center bg-[#F5F5F5] rounded-xl h-10 px-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-primary-blue transition-colors"
                                                    disabled={loading}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                </button>
                                                <span className="w-8 text-center font-bold text-primary-blue">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-primary-blue transition-colors"
                                                    disabled={loading}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[40px] p-8 shadow-lg border border-gray-100 sticky top-32">
                                <h3 className="text-2xl font-bold text-primary-blue mb-6">Sipariş Özeti</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-lg">
                                        <span className="text-text-muted">Ara Toplam</span>
                                        <span className="font-bold text-primary-blue">{cart!.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {cart?.currency || 'TRY'}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-text-muted">Kargo</span>
                                        <span className="font-bold text-green-500">Ücretsiz</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between text-xl">
                                        <span className="font-bold text-primary-blue">Toplam</span>
                                        <span className="font-bold text-secondary-blue text-2xl">{cart!.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {cart?.currency || 'TRY'}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/odeme')}
                                    className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary-orange/20"
                                >
                                    Siparişi Tamamla
                                </button>

                                <div className="mt-6 flex items-center gap-2 justify-center text-sm text-text-muted">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    <span>Güvenli Ödeme</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

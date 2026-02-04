'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('order');

    useEffect(() => {
        // Sipariş ID yoksa ana sayfaya yönlendir
        if (!orderId) {
            router.push('/');
        }
    }, [orderId, router]);

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="bg-white rounded-[40px] p-12 shadow-lg border border-gray-100 text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-primary-blue mb-4">
                        Ödemeniz Başarılı! 🎉
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Siparişiniz başarıyla oluşturuldu ve ödemeniz alındı.
                    </p>

                    {orderId && (
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                            <p className="text-sm text-gray-500 mb-2">Sipariş Numarası</p>
                            <p className="text-2xl font-bold text-primary-blue">#{orderId}</p>
                        </div>
                    )}

                    <p className="text-gray-500 text-sm mb-8">
                        Sipariş detaylarınız e-posta adresinize gönderilecektir.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/hesabim/siparislerim"
                            className="btn-primary px-8 py-4 text-center"
                        >
                            Siparişlerimi Görüntüle
                        </Link>
                        <Link
                            href="/magaza"
                            className="btn-secondary px-8 py-4 text-center"
                        >
                            Alışverişe Devam Et
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .btn-primary {
                    background: linear-gradient(135deg, #F89B29 0%, #FF6B6B 100%);
                    color: white;
                    font-weight: 700;
                    border-radius: 1rem;
                    transition: all 0.3s;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(248, 155, 41, 0.3);
                }
                .btn-secondary {
                    background: #F9F9F9;
                    color: #232E52;
                    font-weight: 700;
                    border-radius: 1rem;
                    transition: all 0.3s;
                }
                .btn-secondary:hover {
                    background: #E9E9E9;
                }
            `}</style>
        </main>
    );
}

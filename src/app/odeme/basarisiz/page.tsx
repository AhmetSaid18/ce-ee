'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PaymentFailedPage() {
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get('msg') || 'Ödeme işlemi sırasında bir hata oluştu.';
    const errorCode = searchParams.get('code');

    // PayTR hata kodlarını kullanıcı dostu mesajlara çevir
    const getErrorDescription = (code: string | null, message: string): string => {
        const errorMessages: Record<string, string> = {
            'insufficient_funds': 'Kartınızda yeterli bakiye bulunmamaktadır.',
            'card_declined': 'Kartınız reddedildi. Lütfen bankanızla iletişime geçin.',
            'invalid_card': 'Kart bilgileri hatalı. Lütfen kontrol edin.',
            'expired_card': 'Kartınızın son kullanma tarihi geçmiş.',
            'cvv_error': 'CVV kodu hatalı.',
        };

        if (code && errorMessages[code]) {
            return errorMessages[code];
        }
        return message;
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="bg-white rounded-[40px] p-12 shadow-lg border border-gray-100 text-center">
                    {/* Error Icon */}
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-primary-blue mb-4">
                        Ödeme Başarısız
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {getErrorDescription(errorCode, errorMessage)}
                    </p>

                    {errorCode && (
                        <div className="bg-red-50 rounded-2xl p-4 mb-8">
                            <p className="text-sm text-red-600">
                                Hata Kodu: {errorCode}
                            </p>
                        </div>
                    )}

                    <p className="text-gray-500 text-sm mb-8">
                        Lütfen kart bilgilerinizi kontrol edip tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/odeme"
                            className="btn-primary px-8 py-4 text-center"
                        >
                            Tekrar Dene
                        </Link>
                        <Link
                            href="/sepet"
                            className="btn-secondary px-8 py-4 text-center"
                        >
                            Sepete Dön
                        </Link>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <p className="text-gray-500 text-sm">
                            Problem devam ediyorsa{' '}
                            <Link href="/sss" className="text-primary-orange hover:underline">
                                destek ekibimizle
                            </Link>
                            {' '}iletişime geçin.
                        </p>
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

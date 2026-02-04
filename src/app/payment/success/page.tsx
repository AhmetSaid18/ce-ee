'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { checkPaymentStatus } from '@/lib/api';

export default function PaymentSuccessCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const orderNumber = searchParams.get('order');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!orderNumber) {
                router.push('/odeme/basarisiz?msg=Sipariş%20numarası%20bulunamadı');
                return;
            }

            try {
                // Ödeme durumunu kontrol et
                const status = await checkPaymentStatus(orderNumber);

                if (status.success && status.payment_status === 'paid') {
                    // Ödeme başarılı - başarı sayfasına yönlendir
                    router.push(`/odeme/basarili?order=${orderNumber}`);
                } else {
                    // Ödeme başarısız
                    router.push(`/odeme/basarisiz?msg=Ödeme%20doğrulanamadı`);
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                router.push('/odeme/basarisiz?msg=Ödeme%20durumu%20kontrol%20edilemedi');
            } finally {
                setChecking(false);
            }
        };

        verifyPayment();
    }, [orderNumber, router]);

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h1 className="text-2xl font-bold text-primary-blue mb-2">
                    Ödeme Doğrulanıyor...
                </h1>
                <p className="text-gray-500">
                    Lütfen bekleyin, ödemeniz kontrol ediliyor.
                </p>
            </div>
        </div>
    );
}

'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentFailCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const errorCode = searchParams.get('code');
    const errorMessage = searchParams.get('msg');

    useEffect(() => {
        // Hata sayfasına yönlendir
        const msg = errorMessage || 'Ödeme işlemi başarısız oldu';
        const code = errorCode ? `&code=${errorCode}` : '';
        router.push(`/odeme/basarisiz?msg=${encodeURIComponent(msg)}${code}`);
    }, [errorCode, errorMessage, router]);

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h1 className="text-2xl font-bold text-primary-blue mb-2">
                    Yönlendiriliyor...
                </h1>
                <p className="text-gray-500">
                    Lütfen bekleyin.
                </p>
            </div>
        </div>
    );
}

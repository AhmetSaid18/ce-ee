import { getCoreApiUrl, getAuthHeaders } from './api-config';

/**
 * Fatura Adresi Interface
 */
interface BillingAddress {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postcode?: string;
    country_code: string;
}

/**
 * Müşteri Bilgileri Interface
 */
interface CustomerInfo {
    email: string;
    name: string;
    phone: string;
    card_number: string;
    card_expiry_month: string;
    card_expiry_year: string;
    card_cvv: string;
    billing?: BillingAddress;
    ip_address?: string;
}

/**
 * Ödeme Payload Interface (3D Secure için)
 */
interface PaymentPayload {
    order_id: string;
    provider?: string;
    customer_info: CustomerInfo;
}

/**
 * Ödeme Response Interface
 */
interface PaymentResponse {
    success: boolean;
    payment_html?: string;  // 3D Secure için banka sayfası HTML'i
    message?: string;
    error?: string;
    offline_message?: string;  // Banka havalesi için
}

/**
 * 3D Secure ödeme başlatır
 * Backend'e ödeme isteği gönderir, payment_html döner
 * 
 * @param payload - Ödeme bilgileri (sipariş ID, customer_info)
 * @returns PaymentResponse - payment_html veya hata
 */
export async function createPayment(payload: PaymentPayload): Promise<PaymentResponse> {
    try {
        // customer_info içindeki kart bilgilerini temizle
        const cleanedCustomerInfo = {
            ...payload.customer_info,
            card_number: payload.customer_info.card_number.replace(/\s/g, ''),
            card_expiry_month: payload.customer_info.card_expiry_month.padStart(2, '0'),
        };

        const response = await fetch(getCoreApiUrl('/payments/create/'), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                order_id: payload.order_id,
                provider: payload.provider || 'kuwait',
                customer_info: cleanedCustomerInfo,
            }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return {
                success: true,
                payment_html: data.payment_html,
                message: data.message,
                offline_message: data.offline_message,
            };
        } else {
            return {
                success: false,
                error: data.error || data.message || 'Ödeme başarısız oldu.',
            };
        }
    } catch (error) {
        console.error('Payment error:', error);
        return {
            success: false,
            error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        };
    }
}

/**
 * Ödeme durumunu kontrol eder
 * 
 * @param orderNumber - Sipariş numarası
 * @returns Ödeme durumu
 */
export async function checkPaymentStatus(orderNumber: string): Promise<{
    success: boolean;
    payment_status?: string;
    order_status?: string;
    error?: string;
}> {
    try {
        const response = await fetch(getCoreApiUrl(`/payments/callback-handler?order=${orderNumber}`), {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return {
                success: true,
                payment_status: data.payment_status,
                order_status: data.order_status,
            };
        } else {
            return {
                success: false,
                error: data.error || 'Ödeme durumu alınamadı.',
            };
        }
    } catch (error) {
        console.error('Payment status check error:', error);
        return {
            success: false,
            error: 'Bir hata oluştu.',
        };
    }
}

/**
 * Ödeme ücretlerini hesaplar (havale indirimi vb.)
 * 
 * @param amount - Tutar
 * @param paymentMethod - Ödeme yöntemi
 * @param currency - Para birimi
 */
export async function calculatePaymentFees(
    amount: number,
    paymentMethod: 'credit_card' | 'bank_transfer',
    currency: string = 'TRY'
): Promise<{
    success: boolean;
    original_amount?: number;
    discount_percentage?: number;
    discount_amount?: number;
    final_amount?: number;
    message?: string;
    error?: string;
}> {
    try {
        const response = await fetch(getCoreApiUrl('/payments/calculate/'), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                amount,
                payment_method: paymentMethod,
                currency,
            }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return {
                success: true,
                original_amount: data.original_amount,
                discount_percentage: data.discount_percentage,
                discount_amount: data.discount_amount,
                final_amount: data.final_amount,
                message: data.message,
            };
        } else {
            return {
                success: false,
                error: data.error || 'Ücret hesaplanamadı.',
            };
        }
    } catch (error) {
        console.error('Payment fee calculation error:', error);
        return {
            success: false,
            error: 'Bir hata oluştu.',
        };
    }
}

/**
 * Sipariş Takip Response Interface
 */
interface OrderTrackResponse {
    success: boolean;
    order_number?: string;
    status?: string;
    payment_status?: string;
    items?: any[];
    total_price?: number;
    created_at?: string;
    error?: string;
}

/**
 * Sipariş takip eder
 * 
 * @param orderNumber - Sipariş numarası (örn: ORD-ATES-1738350000-ABC)
 * @returns OrderTrackResponse - Sipariş durumu
 */
export async function trackOrder(orderNumber: string): Promise<OrderTrackResponse> {
    try {
        const response = await fetch(getCoreApiUrl(`/orders/track/${orderNumber}/`), {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                order_number: data.order_number,
                status: data.status,
                payment_status: data.payment_status,
                items: data.items,
                total_price: data.total_price,
                created_at: data.created_at,
            };
        } else {
            return {
                success: false,
                error: data.error || data.message || 'Sipariş bulunamadı.',
            };
        }
    } catch (error) {
        console.error('Order tracking error:', error);
        return {
            success: false,
            error: 'Bir hata oluştu.',
        };
    }
}

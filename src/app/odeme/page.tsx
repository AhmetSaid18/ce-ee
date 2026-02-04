'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getApiUrl, getCoreApiUrl, getAuthHeaders, getBaseHeaders } from '@/lib/api-config';
import { createPayment } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CheckoutPage() {
    const { cart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Payment
    const [orderId, setOrderId] = useState<string | null>(null);

    // Form States
    const [customer, setCustomer] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        note: ''
    });

    const [card, setCard] = useState({
        holder_name: '',
        number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: ''
    });

    // 1. Sipariş Oluşturma
    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Sepet ID lazım
            if (!cart?.id) throw new Error('Sepet bulunamadı');

            const payload = {
                cart_id: cart.id,
                customer_email: customer.email,
                customer_first_name: customer.first_name,
                customer_last_name: customer.last_name,
                customer_phone: customer.phone,
                shipping_address_id: null, // Backendde adres desteği henüz yoksa null
                customer_note: `Adres: ${customer.address} - Not: ${customer.note}`,
                payment_method: 'credit_card'
            };

            const headers: any = getAuthHeaders();

            const res = await fetch(getCoreApiUrl('/orders/'), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setOrderId(data.id);
                setStep(2); // Ödeme adımına geç
            } else {
                alert(data.message || 'Sipariş oluşturulamadı.');
            }
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // 2. Ödeme Başlatma (3D Secure)
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!orderId) return;

            // 3D Secure ödeme başlat
            const result = await createPayment({
                order_id: orderId,
                provider: 'kuwait',
                customer_info: {
                    email: customer.email,
                    name: `${customer.first_name} ${customer.last_name}`,
                    phone: customer.phone,
                    card_number: card.number,
                    card_expiry_month: card.expiry_month,
                    card_expiry_year: card.expiry_year,
                    card_cvv: card.cvv,
                    billing: {
                        line1: customer.address,
                        city: 'Istanbul',
                        state: 'Istanbul',
                        postcode: '34000',
                        country_code: '792'
                    }
                }
            });

            if (result.success && result.payment_html) {
                // 3D Secure sayfasına yönlendir
                document.open();
                document.write(result.payment_html);
                document.close();
            } else {
                // Hata sayfasına yönlendir
                const errorMsg = encodeURIComponent(result.error || 'Ödeme başarısız');
                router.push(`/odeme/basarisiz?msg=${errorMsg}`);
            }
        } catch (error) {
            console.error(error);
            router.push('/odeme/basarisiz?msg=Beklenmeyen%20bir%20hata%20oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (!cart && !orderId) {
        // Cart yüklenirken veya boşsa
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <h1 className="text-4xl font-bold text-primary-blue mb-8">
                    {step === 1 ? 'Teslimat Bilgileri' : 'Ödeme Yap'}
                </h1>

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN: FORMS */}
                    <div className="lg:col-span-2">
                        {step === 1 ? (
                            <form onSubmit={handleCreateOrder} className="bg-white rounded-[40px] p-8 shadow-lg border border-gray-100 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Ad</label>
                                        <input
                                            required
                                            className="input-field"
                                            value={customer.first_name}
                                            onChange={e => setCustomer({ ...customer, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Soyad</label>
                                        <input
                                            required
                                            className="input-field"
                                            value={customer.last_name}
                                            onChange={e => setCustomer({ ...customer, last_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">E-posta</label>
                                    <input
                                        type="email"
                                        required
                                        className="input-field"
                                        value={customer.email}
                                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Telefon</label>
                                    <input
                                        type="tel"
                                        required
                                        className="input-field"
                                        value={customer.phone}
                                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Adres</label>
                                    <textarea
                                        required
                                        className="input-field h-32 resize-none"
                                        value={customer.address}
                                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="label">Sipariş Notu (Opsiyonel)</label>
                                    <input
                                        className="input-field"
                                        value={customer.note}
                                        onChange={e => setCustomer({ ...customer, note: e.target.value })}
                                    />
                                </div>

                                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-4">
                                    {loading ? 'İşleniyor...' : 'Ödemeye Geç'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handlePayment} className="bg-white rounded-[40px] p-8 shadow-lg border border-gray-100 space-y-6">
                                <div className="bg-orange-50 p-4 rounded-2xl mb-6 text-primary-orange font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    Siparişiniz oluşturuldu (#{orderId}). Lütfen ödemeyi tamamlayın.
                                </div>

                                <div>
                                    <label className="label">Kart Üzerindeki İsim</label>
                                    <input
                                        required
                                        className="input-field"
                                        value={card.holder_name}
                                        onChange={e => setCard({ ...card, holder_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Kart Numarası</label>
                                    <input
                                        required
                                        maxLength={19}
                                        className="input-field"
                                        value={card.number}
                                        onChange={e => setCard({ ...card, number: e.target.value })}
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="label">Ay</label>
                                        <select
                                            className="input-field"
                                            value={card.expiry_month}
                                            onChange={e => setCard({ ...card, expiry_month: e.target.value })}
                                        >
                                            <option value="">Ay</option>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Yıl</label>
                                        <select
                                            className="input-field"
                                            value={card.expiry_year}
                                            onChange={e => setCard({ ...card, expiry_year: e.target.value })}
                                        >
                                            <option value="">Yıl</option>
                                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">CVV</label>
                                        <input
                                            required
                                            maxLength={3}
                                            className="input-field"
                                            value={card.cvv}
                                            onChange={e => setCard({ ...card, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-4">
                                    {loading ? 'Ödeme Yapılıyor...' : `Ödemeyi Tamamla`}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[40px] p-8 shadow-lg border border-gray-100 sticky top-32">
                            <h3 className="text-xl font-bold text-primary-blue mb-6">Özet</h3>

                            {/* Eğer cart varsa göster, yoksa (adım 2'de sipariş özeti gösterilebilir ama cart null olabilir, neyse basit tutalım) */}
                            {cart && (
                                <div className="space-y-4">
                                    {cart.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-sm">
                                            <div className="flex gap-2">
                                                <div className="font-bold text-gray-500">{item.quantity}x</div>
                                                <div className="text-primary-blue">{item.product.name}</div>
                                            </div>
                                            <div className="font-bold text-secondary-blue">
                                                {parseFloat(item.total_price).toLocaleString('tr-TR')}₺
                                            </div>
                                        </div>
                                    ))}

                                    <div className="h-px bg-gray-100 my-4"></div>

                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-primary-blue">Toplam</span>
                                        <span className="text-secondary-blue">{parseFloat(cart.total_price).toLocaleString('tr-TR')}₺</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <Footer />

            <style jsx>{`
                .label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #232E52;
                    margin-bottom: 0.5rem;
                    margin-left: 0.5rem;
                }
                .input-field {
                    width: 100%;
                    padding: 1rem 1.5rem;
                    background-color: #F9F9F9;
                    border-radius: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                .input-field:focus {
                    border-color: #F89B29;
                    background-color: white;
                    box-shadow: 0 4px 12px rgba(248, 155, 41, 0.1);
                }
            `}</style>
        </main>
    );
}

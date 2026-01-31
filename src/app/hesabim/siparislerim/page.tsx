'use client';

import { useEffect, useState } from 'react';
import { getApiUrl, getCoreApiUrl, getAuthHeaders } from '@/lib/api-config';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch(getCoreApiUrl('/orders/'), { headers: getAuthHeaders() });
                const data = await res.json();
                setOrders(data.results || []);
            } catch (err) {
                console.error('Siparişler çekilemedi:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-white rounded-[32px]"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary-blue">Siparişlerim</h1>

            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-light-bg/30">
                                <div className="grid grid-cols-2 sm:flex sm:gap-12 gap-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Sipariş Tarihi</p>
                                        <p className="font-bold text-primary-blue">{new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Toplam</p>
                                        <p className="font-bold text-primary-orange">{parseFloat(order.total).toLocaleString('tr-TR', { style: 'currency', currency: order.currency })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Durum</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            {order.status_display}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Sipariş No</p>
                                    <p className="font-bold text-primary-blue">#{order.order_number}</p>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-light-bg rounded-2xl flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue/30"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary-blue">{order.item_count} Ürün</p>
                                        <p className="text-sm text-text-muted">Detaylı bilgi için incele</p>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-primary-blue text-primary-blue font-bold rounded-2xl hover:bg-primary-blue hover:text-white transition-all">
                                    Sipariş Detayı
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center">
                        <div className="w-24 h-24 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-primary-blue mb-2">Siparişiniz bulunmuyor</h3>
                        <p className="text-text-muted mb-8 max-w-sm mx-auto">Henüz hiç sipariş vermemişsiniz. Hemen mağazamıza göz atın!</p>
                        <Link href="/magaza" className="btn-primary px-10 py-4">Alışverişe Başla</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

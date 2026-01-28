'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiUrl, getAuthHeaders } from '@/lib/api-config';

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        orderCount: 0,
        addressCount: 0,
        recentOrders: [] as any[],
        loading: true
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [ordersRes, addressesRes] = await Promise.all([
                    fetch(getApiUrl('/orders/'), { headers: getAuthHeaders() }),
                    fetch(getApiUrl('/shipping/addresses/'), { headers: getAuthHeaders() })
                ]);

                const ordersData = await ordersRes.json();
                const addressesData = await addressesRes.json();

                setStats({
                    orderCount: ordersData.count || 0,
                    addressCount: Array.isArray(addressesData) ? addressesData.length : (addressesData.results?.length || 0),
                    recentOrders: ordersData.results?.slice(0, 3) || [],
                    loading: false
                });
            } catch (err) {
                console.error('Veri çekme hatası:', err);
                setStats(prev => ({ ...prev, loading: false }));
            }
        }

        fetchData();
    }, []);

    if (stats.loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="h-32 bg-white rounded-[32px]"></div>
                    <div className="h-32 bg-white rounded-[32px]"></div>
                </div>
                <div className="h-64 bg-white rounded-[32px]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-blue">Genel Bakış</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/hesabim/siparislerim" className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary-blue/5 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-primary-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        </div>
                        <div>
                            <p className="text-text-muted font-medium">Toplam Sipariş</p>
                            <h3 className="text-3xl font-bold text-primary-blue">{stats.orderCount}</h3>
                        </div>
                    </div>
                </Link>

                <Link href="/hesabim/adreslerim" className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary-orange/5 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-primary-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        </div>
                        <div>
                            <p className="text-text-muted font-medium">Kayıtlı Adres</p>
                            <h3 className="text-3xl font-bold text-primary-blue">{stats.addressCount}</h3>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary-blue">Son Siparişler</h2>
                    <Link href="/hesabim/siparislerim" className="text-primary-orange font-bold text-sm hover:underline">Tümünü Gör</Link>
                </div>

                <div className="overflow-x-auto">
                    {stats.recentOrders.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-light-bg/50">
                                <tr>
                                    <th className="px-8 py-4 text-sm font-bold text-primary-blue">Sipariş No</th>
                                    <th className="px-8 py-4 text-sm font-bold text-primary-blue">Tarih</th>
                                    <th className="px-8 py-4 text-sm font-bold text-primary-blue">Durum</th>
                                    <th className="px-8 py-4 text-sm font-bold text-primary-blue text-right">Toplam</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-light-bg/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-primary-blue">#{order.order_number}</span>
                                        </td>
                                        <td className="px-8 py-6 text-text-muted">
                                            {new Date(order.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {order.status_display}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right font-bold text-primary-blue">
                                            {parseFloat(order.total).toLocaleString('tr-TR', { style: 'currency', currency: order.currency })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-light-bg rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                            </div>
                            <p className="text-text-muted font-medium">Henüz siparişin bulunmuyor.</p>
                            <Link href="/magaza" className="inline-block mt-4 text-primary-orange font-bold hover:underline">Alışverişe Başla</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

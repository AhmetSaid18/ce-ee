'use client';

import { useEffect, useState } from 'react';
import { getApiUrl, getAuthHeaders } from '@/lib/api-config';

interface Address {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({
        first_name: '',
        last_name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Turkey',
        is_default: false
    });

    const fetchAddresses = async () => {
        try {
            const res = await fetch(getApiUrl('/shipping/addresses/'), { headers: getAuthHeaders() });
            const data = await res.json();
            setAddresses(Array.isArray(data) ? data : (data.results || []));
        } catch (err) {
            console.error('Adresler çekilemedi:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingAddress
            ? getApiUrl(`/shipping/addresses/${editingAddress.id}/`)
            : getApiUrl('/shipping/addresses/');

        const method = editingAddress ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingAddress(null);
                setFormData({ country: 'Turkey', is_default: false });
                fetchAddresses();
            }
        } catch (err) {
            console.error('Adres kaydedilemedi:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(getApiUrl(`/shipping/addresses/${id}/`), {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) fetchAddresses();
        } catch (err) {
            console.error('Adres silinemedi:', err);
        }
    };

    const openEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData(address);
        setIsModalOpen(true);
    };

    if (loading) return <div className="animate-pulse space-y-4">{[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-[32px]"></div>)}</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-blue">Adreslerim</h1>
                <button
                    onClick={() => { setEditingAddress(null); setFormData({ country: 'Turkey', is_default: false }); setIsModalOpen(true); }}
                    className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Yeni Adres Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <div key={address.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${address.is_default ? 'bg-primary-orange/10 text-primary-orange' : 'bg-gray-100 text-gray-500'}`}>
                                    {address.is_default ? 'Varsayılan' : 'Adres'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEdit(address)} className="p-2 text-text-muted hover:text-primary-blue transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(address.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-primary-blue mb-1">{address.first_name} {address.last_name}</h3>
                            <p className="text-primary-orange font-medium text-sm mb-4">{address.phone}</p>
                            <p className="text-text-muted leading-relaxed">
                                {address.address_line_1} {address.address_line_2}<br />
                                {address.state} / {address.city}<br />
                                {address.postal_code}, {address.country}
                            </p>
                        </div>
                    </div>
                ))}

                {addresses.length === 0 && (
                    <div className="col-span-full bg-white p-20 rounded-[40px] border border-gray-100 text-center">
                        <p className="text-text-muted">Kayıtlı adresiniz bulunmuyor.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary-blue/20 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-primary-blue">{editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-text-muted hover:text-primary-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-primary-blue mb-2">Ad</label>
                                    <input required className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none"
                                        value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-primary-blue mb-2">Soyad</label>
                                    <input required className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none"
                                        value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary-blue mb-2">Telefon</label>
                                <input required className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary-blue mb-2">Adres</label>
                                <textarea required className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none h-32"
                                    value={formData.address_line_1} onChange={e => setFormData({ ...formData, address_line_1: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-primary-blue mb-2">Şehir</label>
                                    <input required className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none"
                                        value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-primary-blue mb-2">İlçe</label>
                                    <input required className="w-full px-6 py-4 bg-light-bg rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none"
                                        value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="is_default" className="w-5 h-5 accent-primary-orange"
                                    checked={formData.is_default} onChange={e => setFormData({ ...formData, is_default: e.target.checked })} />
                                <label htmlFor="is_default" className="text-sm font-bold text-primary-blue">Bu adresi varsayılan olarak ayarla</label>
                            </div>
                            <button type="submit" className="w-full btn-primary py-4 text-lg">Kaydet</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

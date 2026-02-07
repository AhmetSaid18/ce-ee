'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_CONFIG, getBaseHeaders, getAuthHeaders } from '@/lib/api-config';

// --- Types ---
export interface CartItem {
    id: string; // Basket Item UUID or Local ID
    product_id: string;
    product_name: string;
    variant_name: string | null;
    unit_price: number;
    quantity: number;
    total_price: number;
    image_url: string;
}

export interface Cart {
    id: string;
    total_price: number;
    currency: string;
    items: CartItem[];
}

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addToCart: (productId: string, quantity?: number, variantId?: string | null, productInfo?: any) => Promise<boolean>;
    removeFromCart: (itemId: string) => Promise<boolean>;
    updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
    refreshCart: () => Promise<void>;
    itemCount: number;
    clearCart: () => void;
}

// --- Context ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider ---
export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Cart URL helper
    const getCartUrl = (path: string) => {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_CONFIG.BASE_URL}/api${cleanPath}`;
    };

    // Auth durumunu kontrol et
    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem('auth_token');
            setIsLoggedIn(!!token);
        };

        checkLogin();

        window.addEventListener('storage', checkLogin);
        window.addEventListener('login', checkLogin);

        return () => {
            window.removeEventListener('storage', checkLogin);
            window.removeEventListener('login', checkLogin);
        };
    }, []);

    // 1. Sepeti Getir (Hybrid)
    const refreshCart = async () => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            // --- LOGGED IN USER: BACKEND ---
            try {
                const headers: any = getAuthHeaders();
                const res = await fetch(getCartUrl('/basket/'), {
                    headers: headers
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log('Backend basket response:', data); // DEBUG

                    if (data.success && data.basket) {
                        // Backend formatını frontend formatına dönüştür
                        const backendBasket = data.basket;
                        const mappedCart: Cart = {
                            id: backendBasket.id,
                            total_price: parseFloat(backendBasket.subtotal) || parseFloat(backendBasket.total_price) || 0,
                            currency: backendBasket.currency || 'TRY',
                            items: (backendBasket.items || []).map((item: any) => ({
                                id: item.id,
                                product_id: item.product_id || item.product?.id,
                                product_name: item.product_name || item.product?.name || 'Ürün',
                                variant_name: item.variant_name || item.variant?.name || null,
                                unit_price: parseFloat(item.unit_price) || parseFloat(item.price) || 0,
                                quantity: item.quantity || 1,
                                total_price: parseFloat(item.line_total) || parseFloat(item.total_price) || 0,
                                image_url: item.image_url || item.product?.primary_image || item.product?.images?.[0]?.image_url || '/hero-bear.png'
                            }))
                        };
                        console.log('Mapped cart:', mappedCart); // DEBUG
                        setCart(mappedCart);
                    } else if (data.id) {
                        // Backend doğrudan cart objesi dönebilir
                        setCart(data);
                    } else {
                        setCart(null);
                    }
                } else {
                    setCart(null);
                }
            } catch (error) {
                console.error('Backend sepet yükleme hatası:', error);
                setCart(null);
            }
        } else {
            // --- GUEST USER: LOCAL STORAGE ---
            const localCartStr = localStorage.getItem('guest_cart');
            if (localCartStr) {
                const localCart: Cart = JSON.parse(localCartStr);
                setCart(localCart);
            } else {
                setCart(null);
            }
        }
    };

    // İlk yükleme ve Login durumunda sepeti çek
    useEffect(() => {
        refreshCart();
    }, [isLoggedIn]);

    // Login olunca LocalStorage'daki sepeti Backend'e aktar (Sync)
    useEffect(() => {
        const syncCart = async () => {
            const token = localStorage.getItem('auth_token');
            const localCartStr = localStorage.getItem('guest_cart');

            if (token && localCartStr) {
                const localCart: Cart = JSON.parse(localCartStr);

                // Eğer localde ürün varsa sırayla backende ekle
                if (localCart.items.length > 0) {
                    setLoading(true);
                    for (const item of localCart.items) {
                        try {
                            const headers = getAuthHeaders();
                            await fetch(getCartUrl('/basket/'), {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify({
                                    product_id: item.product_id,
                                    quantity: item.quantity,
                                    variant_id: null // Varyant desteği eklenirse buraya dikkat
                                })
                            });
                        } catch (err) {
                            console.error('Sync item error:', err);
                        }
                    }
                    // Sync bitince local sepeti temizle
                    localStorage.removeItem('guest_cart');
                    // Backend sepetini güncelle
                    await refreshCart();
                    setLoading(false);
                }
            }
        };

        if (isLoggedIn) {
            syncCart();
        }
    }, [isLoggedIn]);


    // Helper: Fiyat temizle
    const parsePrice = (price: any) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            // "1.490,00" -> "1490.00" (TRY format tahmini: Nokta binlik, virgül ondalık)
            if (price.includes(',') && price.includes('.')) {
                return parseFloat(price.replace(/\./g, '').replace(',', '.')) || 0;
            }
            // "1490,00" -> "1490.00"
            if (price.includes(',')) {
                return parseFloat(price.replace(',', '.')) || 0;
            }
            return parseFloat(price) || 0;
        }
        return 0;
    };

    // 2. Sepete Ekle
    const addToCart = async (productId: string, quantity: number = 1, variantId: string | null = null, productInfo?: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            if (token) {
                // --- BACKEND ---
                const headers = getAuthHeaders();
                const res = await fetch(getCartUrl('/basket/'), {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        product_id: productId,
                        quantity: quantity,
                        variant_id: variantId
                    }),
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    await refreshCart();
                    return true;
                } else {
                    console.error('Sepete ekleme hatası:', data);
                    alert(data.message || 'Ürün sepete eklenemedi.');
                    return false;
                }
            } else {
                // --- LOCAL STORAGE ---
                console.log('Adding to local cart:', productInfo); // Debug log

                if (!productInfo) {
                    console.error('Product Info missing for local cart!');
                    // Fallback: Ürün bilgisi yoksa ekleme yapma veya fetch etmeye çalış
                    // Şimdilik ekliyoruz ama 'Bilinmeyen Ürün' olarak
                }

                const price = parsePrice(productInfo?.price);

                let itemToAdd = {
                    id: `local_${Date.now()}`,
                    product_id: productId,
                    product_name: productInfo?.name || 'Bilinmeyen Ürün',
                    variant_name: null,
                    unit_price: price,
                    quantity: quantity,
                    total_price: price * quantity,
                    image_url: productInfo?.primary_image || productInfo?.images?.[0]?.image_url || '/hero-bear.png'
                };

                const currentCart = cart || { id: 'local', total_price: 0, currency: 'TRY', items: [] };
                const existingItemIndex = currentCart.items.findIndex(i => i.product_id === productId);

                let newItems = [...currentCart.items];

                if (existingItemIndex > -1) {
                    // Miktar artır
                    newItems[existingItemIndex].quantity += quantity;
                    newItems[existingItemIndex].total_price = newItems[existingItemIndex].quantity * newItems[existingItemIndex].unit_price;
                } else {
                    // Yeni ekle
                    newItems.push(itemToAdd);
                }

                // Toplam hesapla
                const newTotal = newItems.reduce((acc, item) => acc + item.total_price, 0);

                const newCart = {
                    ...currentCart,
                    total_price: newTotal,
                    items: newItems
                };

                setCart(newCart);
                localStorage.setItem('guest_cart', JSON.stringify(newCart));
                return true;
            }
        } catch (error) {
            console.error('Sepet ekleme hatası:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 3. Miktar Güncelle
    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity <= 0) return removeFromCart(itemId);
        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');

            if (token) {
                // --- BACKEND ---
                const headers = getAuthHeaders();
                const res = await fetch(getCartUrl(`/basket/${itemId}/`), {
                    method: 'PATCH',
                    headers: headers,
                    body: JSON.stringify({ quantity })
                });
                if (res.ok) {
                    await refreshCart();
                    return true;
                } else {
                    return false;
                }
            } else {
                // --- LOCAL STORAGE ---
                if (!cart) return false;

                const newItems = cart.items.map(item => {
                    if (item.id === itemId) {
                        return {
                            ...item,
                            quantity: quantity,
                            total_price: item.unit_price * quantity
                        };
                    }
                    return item;
                });

                const newTotal = newItems.reduce((acc, item) => acc + item.total_price, 0);
                const newCart = { ...cart, total_price: newTotal, items: newItems };

                setCart(newCart);
                localStorage.setItem('guest_cart', JSON.stringify(newCart));
                return true;
            }
        } catch (error) {
            console.error('Miktar güncelleme hatası:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 4. Sepetten Sil
    const removeFromCart = async (itemId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            if (token) {
                // --- BACKEND ---
                const headers = getAuthHeaders();
                const res = await fetch(getCartUrl(`/basket/${itemId}/`), {
                    method: 'DELETE',
                    headers: headers
                });
                if (res.ok) {
                    await refreshCart();
                    return true;
                } else {
                    return false;
                }
            } else {
                // --- LOCAL STORAGE ---
                if (!cart) return false;

                const newItems = cart.items.filter(item => item.id !== itemId);
                const newTotal = newItems.reduce((acc, item) => acc + item.total_price, 0);
                const newCart = { ...cart, total_price: newTotal, items: newItems };

                setCart(newCart);
                localStorage.setItem('guest_cart', JSON.stringify(newCart));
                return true;
            }
        } catch (error) {
            console.error('Sepetten silme hatası:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = () => {
        setCart(null);
        localStorage.removeItem('guest_cart');
    };

    const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            refreshCart,
            itemCount,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

// --- Hook ---
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPublicApiUrl, getBaseHeaders } from '@/lib/api-config';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const router = useRouter();
  const { itemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth_token'));
  }, []);

  const handleStoreClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(getPublicApiUrl('/products/'), {
        headers: getBaseHeaders()
      });
      const data = await res.json();

      if (data.results && data.results.length === 1) {
        const slug = data.results[0].slug;
        router.push(`/magaza/${slug}`);
      } else {
        router.push('/magaza');
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
      router.push('/magaza');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="relative w-24 h-12">
              <Image
                src="/logo.png"
                alt="ce-ee logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">Ana Sayfa</Link>
            <button
              onClick={handleStoreClick}
              disabled={loading}
              className="nav-link"
            >
              {loading ? '...' : 'Satın Al'}
            </button>
            <Link href="/kilavuz" className="nav-link">Kullanım Kılavuzu</Link>
            <Link href="/sss" className="nav-link">S.S.S</Link>
            <Link href="/iletisim" className="nav-link">İletişim</Link>
          </div>

          <div className="flex items-center space-x-5">
            <button className="p-2 text-primary-blue hover:text-primary-orange transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <div className="relative">
              <button
                onClick={() => router.push('/sepet')}
                className="p-2 text-primary-blue hover:text-primary-orange transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-orange text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
            {isLoggedIn ? (
              <Link href="/hesabim" className="hidden sm:flex items-center space-x-2 text-primary-blue font-semibold hover:text-primary-orange transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Hesabım</span>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center space-x-2 text-primary-blue font-semibold hover:text-primary-orange transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Giriş Yap / Kayıt Ol</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

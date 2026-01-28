'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-[#162145] text-white py-16 px-4">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Logo */}
                <div className="mb-10">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="ce-ee logo"
                            width={100}
                            height={50}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-sm md:text-base font-medium opacity-80">
                    <Link href="/affiliate" className="hover:text-secondary-blue transition-colors">Affiliate Programı</Link>
                    <Link href="/teslimat" className="hover:text-secondary-blue transition-colors">Teslimat ve İade Şartları</Link>
                    <Link href="/kilavuz" className="hover:text-secondary-blue transition-colors">Kullanım Kılavuzu</Link>
                    <Link href="/sss" className="hover:text-secondary-blue transition-colors text-secondary-blue">Sıkça Sorulan Sorular</Link>
                    <Link href="/sozlesme" className="hover:text-secondary-blue transition-colors">Mesafeli Satış Sözleşmesi</Link>
                    <Link href="/gizlilik" className="hover:text-secondary-blue transition-colors">Gizlilik Politikası</Link>
                </nav>

                {/* Social Media */}
                <div className="flex gap-6 mb-12">
                    <a href="#" className="hover:text-secondary-blue transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" className="hover:text-secondary-blue transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                    </a>
                    <a href="#" className="hover:text-secondary-blue transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    </a>
                    <a href="#" className="hover:text-secondary-blue transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="hover:text-secondary-blue transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                </div>

                {/* Payment Methods */}
                <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xl font-bold tracking-tighter">iyzico <span className="text-xs font-normal">ile Öde</span></span>
                    <svg width="40" height="24" viewBox="0 0 32 24" fill="currentColor"><circle cx="7" cy="12" r="7" fill="#EB001B" /><circle cx="16" cy="12" r="7" fill="#F79E1B" /><circle cx="11.5" cy="12" r="7" fill="#FF5F00" fillOpacity="0.8" /></svg>
                    <span className="text-2xl font-black italic tracking-tighter">VISA</span>
                    <span className="text-sm font-bold border border-white/40 px-2 py-0.5 rounded">AMERICAN EXPRESS</span>
                    <span className="text-xl font-bold italic">Troy</span>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-white/10 mb-8"></div>

                {/* Bottom Bar */}
                <div className="w-full text-center text-sm opacity-50">
                    CE-EE ©. All Rights Reserved.
                </div>
            </div>

            {/* Floating Widget Placeholder */}
            <div className="fixed bottom-6 right-6 z-50 group cursor-pointer">
                <div className="relative">
                    <div className="absolute -top-12 -left-16 bg-white text-primary-dark px-4 py-2 rounded-2xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        We Are Here!
                    </div>
                    <div className="w-16 h-16 bg-secondary-blue rounded-full flex items-center justify-center shadow-2xl animate-bounce hover:animate-none">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        </svg>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

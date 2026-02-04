'use client';

import { useState } from 'react';

const faqData = [
    {
        question: "Pil ömrü ne kadar sürüyor?",
        answer: "CE-EE Oyun Arkadaşı, uzun ömürlü piller kullanılarak tasarlandı. Normal kullanımda pil ömrü ortalama olarak 6 ay ila 1 yıl arasında değişmektedir."
    },
    {
        question: "İçeriği hakkında daha fazla bilgi alabilir miyim?",
        answer: "Tabii, CE-EE Oyun Arkadaşı, Avrupa Birliği güvenlik standartlarına uygun olarak üretilmiş yumuşak peluş bir oyuncaktır. Türkçe konuşma ve ses taklit özellikleriyle donatılmıştır."
    },
    {
        question: "Nerelerden temin edebilirim?",
        answer: "CE-EE Oyun Arkadaşı, bebek ve çocuk mağazalarında, oyuncak mağazalarında ve çeşitli e-ticaret platformlarında bulunabilir. Toptan satış için bizimle iletişime geçebilirsiniz."
    },
    {
        question: "Hangi yaş grubuna uygun olduğu hakkında bilgi alabilir miyim?",
        answer: "CE-EE Oyun Arkadaşı, 0-3 yaş arası bebekler için tasarlanmıştır. Bebeklerin eğlenceli ve öğretici bir dünyayı keşfetmelerine yardımcı olmak için idealdir."
    },
    {
        question: "Kullanırken güvenlikle ilgili nelere dikkat etmeliyim?",
        answer: "CE-EE Oyun Arkadaşı'nı kullanırken, bebeklerin oyuncakla yalnız bırakılmaması ve uygun yaş grupları dikkate alınmalıdır. Ayrıca, ürünün pil kapağının sıkıca kapatıldığından emin olunmalı ve oyuncak yıpranmışsa hemen değiştirilmelidir."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-gradient-to-b from-[#F8FBFF] to-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-secondary-pink/10 rounded-full blur-3xl"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 text-primary-blue font-bold uppercase tracking-widest text-sm mb-4 px-4 py-2 bg-blue-50 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Sıkça Sorulan
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
                        Merak <span className="gradient-text">Ettikleriniz</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-xl mx-auto">
                        CE-EE hakkında sık sorulan soruları ve cevaplarını burada bulabilirsiniz.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all duration-500 ${openIndex === index
                                    ? 'border-primary-orange/30 shadow-lg shadow-primary-orange/10'
                                    : 'border-gray-100 hover:shadow-md hover:border-gray-200'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 text-left flex justify-between items-center group"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Gradient left border indicator when open */}
                                    <div className={`w-1 h-8 rounded-full transition-all duration-300 ${openIndex === index
                                            ? 'bg-gradient-to-b from-primary-orange to-secondary-pink'
                                            : 'bg-gray-200 group-hover:bg-primary-orange/50'
                                        }`}></div>
                                    <span className={`text-xl font-bold transition-colors duration-300 ${openIndex === index
                                            ? 'gradient-text-blue'
                                            : 'text-primary-dark group-hover:text-primary-blue'
                                        }`}>
                                        {faq.question}
                                    </span>
                                </div>
                                <span className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index
                                        ? 'bg-gradient-to-br from-primary-orange to-secondary-pink text-white rotate-45'
                                        : 'bg-gray-100 text-gray-400 group-hover:bg-primary-orange/10 group-hover:text-primary-orange'
                                    }`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-8 pb-8 pl-[72px] text-lg text-text-muted leading-relaxed">
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="pt-4">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center">
                    <p className="text-text-muted mb-4">Başka sorunuz mu var?</p>
                    <a
                        href="/iletisim"
                        className="inline-flex items-center gap-2 text-primary-orange font-bold hover:text-primary-blue transition-colors group"
                    >
                        Bize Ulaşın
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;

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
        answer: "CE-EE Oyun Arkadaşı’nı kullanırken, bebeklerin oyuncakla yalnız bırakılmaması ve uygun yaş grupları dikkate alınmalıdır. Ayrıca, ürünün pil kapağının sıkıca kapatıldığından emin olunmalı ve oyuncak yıpranmışsa hemen değiştirilmelidir."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[#F8FBFF]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
                        Sıkça Sorulan Sorular
                    </h2>
                    <div className="flex justify-center">
                        <svg className="w-8 h-8 text-primary-dark/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 text-left flex justify-between items-center group"
                            >
                                <span className={`text-xl font-bold transition-colors duration-300 ${openIndex === index ? 'text-secondary-blue' : 'text-primary-dark group-hover:text-secondary-blue'}`}>
                                    {faq.question}
                                </span>
                                <span className={`flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                                    <svg className={`w-8 h-8 ${openIndex === index ? 'text-secondary-blue' : 'text-primary-dark/20 group-hover:text-secondary-blue/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-8 pb-8 text-lg text-text-muted leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;

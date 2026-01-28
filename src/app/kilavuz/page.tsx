import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function KilavuzPage() {
    return (
        <main className="min-h-screen bg-white pt-20 flex flex-col">
            <Navbar />

            {/* Page Header */}
            <section className="bg-primary-blue/5 py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary-dark">
                        Kullanım Kılavuzu
                    </h1>
                    <p className="mt-4 text-lg text-text-muted">
                        CE-EE Oyun Arkadaşı'nı daha yakından tanıyın ve güvenle kullanın.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 flex-grow">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center gap-3">
                                <span className="w-10 h-10 bg-secondary-blue text-white rounded-full flex items-center justify-center text-lg">1</span>
                                Ürün Tanımı
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                CE-EE Oyun Arkadaşı, 0-3 yaş arası bebekler için eğlenceli ve öğretici bir oyuncaktır.
                                Avrupa Birliği güvenlik standartlarına uygun olarak üretilmiş olan bu oyuncak,
                                yumuşak peluş malzemeden yapılmıştır ve Türkçe konuşma ve ses taklit özelliklerine sahiptir.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary-orange text-white rounded-full flex items-center justify-center text-lg">2</span>
                                Pil Yerleştirme
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                CE-EE Oyun Arkadaşı’nın kullanılabilmesi için pil gerekmektedir. Pil yuvası ürünün arkasında bulunmaktadır.
                                Pil takma işlemi için öncelikle pil kapağını çıkarın. Daha sonra uygun şekilde pilleri yerleştirin ve
                                pil kapağını sıkıca kapatın.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center gap-3">
                                <span className="w-10 h-10 bg-red-400 text-white rounded-full flex items-center justify-center text-lg text-white">3</span>
                                Güvenlik Uyarıları
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "CE-EE Oyun Arkadaşı, 0-3 yaş arası bebekler için tasarlanmıştır. Oyuncakla yalnız bırakılmamalı ve uygun yaş grubuna göre kullanılmalıdır.",
                                    "Ürünün pil kapağı sıkıca kapatılmalıdır. Pil yuvasına su veya diğer sıvı maddelerin temas etmesinden kaçınılmalıdır.",
                                    "Oyuncak yıpranmış veya hasar görmüşse, hemen kullanımdan kaldırılmalı ve değiştirilmelidir.",
                                    "Bebeğin CE-EE Oyun Arkadaşı ile oynaması sırasında dikkatli olunmalı ve bebek uyurken oyuncak bebeğin yanında bırakılmamalıdır."
                                ].map((warn, idx) => (
                                    <li key={idx} className="flex gap-4 text-lg text-text-muted leading-relaxed">
                                        <div className="mt-2.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                        {warn}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center gap-3">
                                <span className="w-10 h-10 bg-green-400 text-white rounded-full flex items-center justify-center text-lg">4</span>
                                Bakım ve Temizlik
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                CE-EE Oyun Arkadaşı’nın temizliği için yumuşak bir bez ve hafifçe sabunlu su kullanılabilir.
                                Oyuncak tamamen kuruduktan sonra tekrar kullanılabilir.
                                Makinede yıkanmamalı veya aşırı ısıya maruz bırakılmamalıdır.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

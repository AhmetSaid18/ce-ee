import Navbar from '@/components/layout/Navbar';
import FAQ from '@/components/home/FAQ';
import Footer from '@/components/layout/Footer';

export default function SSSPage() {
    return (
        <main className="min-h-screen bg-white pt-20 flex flex-col">
            <Navbar />
            <div className="py-20 flex-grow">
                <FAQ />
            </div>
            <Footer />
        </main>
    );
}

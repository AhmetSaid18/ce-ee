import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />

      <Footer />
    </main>
  );
}

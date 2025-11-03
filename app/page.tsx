import Header from '@/components/Header';
import Hero from '@/components/Hero';
import KeyFeatures from '@/components/KeyFeatures';
import FeaturedProperties from '@/components/FeaturedProperties';
import Experience from '@/components/Experience';
import WhyChoose from '@/components/WhyChoose';
import WhyInvest from '@/components/WhyInvest';
import Footer from '@/components/Footer';
import WhatsAppChat from '@/components/WhatsAppChat';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <KeyFeatures />
      <FeaturedProperties />
      <Experience />
      <WhyChoose />
      <WhyInvest />
      <Footer />
      <WhatsAppChat />
    </main>
  );
}


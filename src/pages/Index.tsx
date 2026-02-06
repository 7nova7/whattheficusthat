import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustBar } from '@/components/home/TrustBar';
import { AboutSection } from '@/components/home/AboutSection';
import { ShopSection } from '@/components/home/ShopSection';
import { LiveStreamSection } from '@/components/home/LiveStreamSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { ShippingSection } from '@/components/home/ShippingSection';
import { ContactSection } from '@/components/home/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <AboutSection />
        <ShopSection />
        <LiveStreamSection />
        <ReviewsSection />
        <ShippingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

import DownloadSection from '@/components/DownloadSection';
import FeaturesSection from '@/components/FeaturesSection';
import FooterSection from '@/components/FooterSection';
import HeaderSection from '@/components/HeaderSection';
import HeroSection from '@/components/HeroSection';
import ScrollAndHeaderEffect from '@/components/ScrollAndHeaderEffect';

export default function Home() {
  return (
    <main>
      <ScrollAndHeaderEffect />
      <HeaderSection />
      <HeroSection />
      <FeaturesSection />
      <DownloadSection />
      <FooterSection />
    </main>
  );
}

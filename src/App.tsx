import { useEffect } from 'react';
import DownloadSection from './components/DownloadSection';
import FeaturesSection from './components/FeaturesSection';
import FooterSection from './components/FooterSection';
import HeaderSection from './components/HeaderSection';
import HeroSection from './components/HeroSection';

function App() {
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    const onScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 100) {
        header?.classList.add('shadow-lg');
      } else {
        header?.classList.remove('shadow-lg');
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className='font-sans overflow-x-hidden'>
      <HeaderSection />
      <HeroSection />
      <FeaturesSection />
      <DownloadSection />
      <FooterSection />
    </div>
  );
}

export default App;

import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id='home'
      className='min-h-screen flex items-center relative bg-gradient-to-br from-[#3D7EF9] to-[#2B529B] pt-24'
    >
      <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center z-10'>
        <div className='text-white'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            {t('hero.title')}
          </h1>
          <p className='text-lg mb-6'>{t('hero.description')}</p>
          <div className='flex flex-wrap gap-4'>
            <a
              href='#download'
              className='bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 transition'
            >
              📱 {t('hero.download')}
            </a>
            <a
              href='#features'
              className='border border-white/40 text-white px-6 py-3 rounded-full backdrop-blur hover:bg-white/20 transition'
            >
              🔍 {t('hero.learnMore')}
            </a>
          </div>
        </div>
        <img src='/phone.png' alt='phone' className='w-7xl animate-float p-6' />
      </div>
    </section>
  );
};

export default HeroSection;

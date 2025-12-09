import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const HeroSection = async () => {
  const t = await getTranslations();

  return (
    <section
      id='home'
      className='min-h-screen flex items-center relative bg-gradient-to-br from-[#3D7EF9] via-[#2B529B] to-[#1a3d7a] pt-24 overflow-hidden'
    >
      {/* Decorative background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 items-center gap-12 z-10 relative'>
        <div className='text-white space-y-6 animate-fade-in'>
          <div className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-2 border border-white/20'>
            🚀 {t('hero.title')?.split(' ')[0] || 'Cargo TM'}
          </div>
          <h1 className='text-5xl md:text-4xl lg:text-5xl font-bold leading-tight'>
            <span className='bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
              {t('hero.title')}
            </span>
          </h1>
          <p className='text-md md:text-lg text-blue-100 leading-relaxed max-w-xl'>
            {t('hero.description')}
          </p>
          <div className='flex flex-wrap gap-4 pt-4'>
            <a
              href='https://play.google.com/store/apps/details?id=tm.com.cargotm'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative flex items-center justify-center hover:scale-105 transition-all duration-300 hover:-translate-y-1'
            >
              <Image
                height={80}
                width={240}
                className='w-48 md:w-56 h-auto'
                src='/google_play.png'
                alt='Google Play Store'
              />
            </a>
            <a
              href='https://apps.apple.com/tm/app/Cargo TM/id6748551361'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative flex items-center justify-center hover:scale-105 transition-all duration-300 hover:-translate-y-1'
            >
              <Image
                height={80}
                width={208}
                className='w-44 md:w-52 h-auto'
                src='/app_store.png'
                alt='App Store'
              />
            </a>
          </div>
        </div>
        <div className='relative flex justify-center items-center'>
          <div className='relative z-10'>
            <Image
              width={672}
              height={150}
              src='/phone.png'
              alt='phone'
              className='w-full max-w-md md:max-w-lg lg:max-w-xl animate-float drop-shadow-2xl'
              priority
            />
          </div>
          {/* Glow effect around phone */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl scale-150 animate-pulse'></div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
          <div className='w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-scroll'></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

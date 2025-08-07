import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const HeroSection = async () => {
  const t = await getTranslations();

  return (
    <section
      id='home'
      className='min-h-screen flex items-center relative bg-gradient-to-br from-[#3D7EF9] to-[#2B529B] pt-24'
      role='banner'
      aria-labelledby='hero-title'
    >
      <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 items-center z-10'>
        <header className='text-white'>
          <h1 id='hero-title' className='text-4xl md:text-5xl font-bold mb-4'>
            {t('hero.title')}
          </h1>
          <p className='text-lg mb-6' role='doc-subtitle'>
            {t('hero.description')}
          </p>
          <div className='flex gap-2' role='group' aria-label='Download applications'>
            <a
              href='/tm-cargo.apk'
              target='_blank'
              download
              className='flex gap-2 items-center bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 transition focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600'
              aria-label={`${t('hero.downloadAndroid')} - Download APK file`}
            >
              <Image
                width={24}
                height={24}
                className='w-6'
                src='/android.png'
                alt='Android operating system logo'
                loading='eager'
              />
              {t('hero.downloadAndroid')}
            </a>
            <a
              href='https://apps.apple.com/tm/app/tmcargo/id6748551361'
              target='_blank'
              rel='noopener noreferrer'
              className='flex gap-2 items-center bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 transition focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600'
              aria-label={`${t('hero.downloadIOS')} - Open App Store`}
            >
              <Image
                width={24}
                height={24}
                className='w-6'
                src='/apple.png'
                alt='Apple iOS operating system logo'
                loading='eager'
              />
              {t('hero.downloadIOS')}
            </a>
          </div>
        </header>
        <figure className='flex justify-center'>
          <Image
            width={672}
            height={1200}
            src='/phone.png'
            alt='TM Cargo mobile application interface showing cargo search and transport booking features'
            className='w-2xl animate-float p-6'
            loading='eager'
            priority
            sizes='(max-width: 768px) 100vw, 50vw'
          />
        </figure>
      </div>
    </section>
  );
};

export default HeroSection;

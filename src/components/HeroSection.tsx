import { getI18n } from '@/locales/server';
import Image from 'next/image';

const HeroSection = async () => {
  const t = await getI18n();

  return (
    <section
      id='home'
      className='min-h-screen flex items-center relative bg-gradient-to-br from-[#3D7EF9] to-[#2B529B] pt-24'
    >
      <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 items-center z-10'>
        <div className='text-white'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            {t('hero.title')}
          </h1>
          <p className='text-lg mb-6'>{t('hero.description')}</p>
          <div className='flex gap-2'>
            <a
              href='/tm-cargo.apk'
              target='_blank'
              download
              className='flex gap-2 items-center bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 transition'
            >
              <Image
                width={24}
                height={24}
                className='w-6'
                src='/android.png'
                alt='Android icon'
              />{' '}
              {t('hero.downloadAndroid')}
            </a>
            <a
              href='https://apps.apple.com/tm/app/tmcargo/id6748551361'
              target='_blank'
              className='flex gap-2 items-center bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 transition'
            >
              <Image
                width={24}
                height={24}
                className='w-6'
                src='/apple.png'
                alt='ios icon'
              />{' '}
              {t('hero.downloadIOS')}
            </a>{' '}
          </div>
        </div>
        <Image
          width={672}
          height={150}
          src='/phone.png'
          alt='phone'
          className='w-2xl animate-float p-6'
        />
      </div>
    </section>
  );
};

export default HeroSection;

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const DownloadSection = async () => {
  const t = await getTranslations();

  return (
    <section
      id='download'
      className='relative py-24 bg-gradient-to-br from-[#3D7EF9] via-[#2B529B] to-[#1a3d7a] text-white overflow-hidden'
    >
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl'></div>
      </div>

      <div className='relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <div className='mb-8'>
          <div className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20'>
            📱 {t('downloadText.title')?.split(' ')[0] || 'Download'}
          </div>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            {t('downloadText.title')}
          </h2>
          <p className='text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed'>
            {t('downloadText.subtitle')}
          </p>
        </div>
        
        <div className='flex flex-wrap justify-center gap-6 mt-12'>
          <a
            href='https://play.google.com/store/apps/details?id=tm.com.cargotm'
            target='_blank'
            rel='noopener noreferrer'
            className='group relative flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20'
          >
            <Image
              height={80}
              width={240}
              className='w-56 md:w-64 h-auto'
              src='/google_play.png'
              alt='Google Play Store'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
          </a>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://apps.apple.com/tm/app/Cargo TM/id6748551361'
            className='group relative flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20'
          >
            <Image
              height={80}
              width={208}
              className='w-52 md:w-60 h-auto'
              src='/app_store.png'
              alt='App Store'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
          </a>
        </div>

        {/* Stats or additional info can go here */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'>
          <div className='text-center'>
            <div className='text-3xl font-bold mb-2'>🚀</div>
            <div className='text-sm text-blue-200'>Быстрая установка</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold mb-2'>🔒</div>
            <div className='text-sm text-blue-200'>Безопасно</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold mb-2'>⭐</div>
            <div className='text-sm text-blue-200'>Бесплатно</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;

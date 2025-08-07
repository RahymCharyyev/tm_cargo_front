import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

const HeaderSection = async () => {
  const t = await getTranslations();

  return (
    <header 
      className='fixed top-0 w-full bg-white/95 backdrop-blur z-50 transition-all'
      role='banner'
    >
      <nav 
        className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='flex items-center gap-2'>
          <Image
            width={48}
            height={48}
            className='w-12'
            src='/icon.png'
            alt='TM Cargo company logo'
            loading='eager'
          />
          <div 
            className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D7EF9] to-[#2B529B]'
            role='img'
            aria-label='TM Cargo brand name'
          >
            TmCargo
          </div>
        </div>
        <ul 
          className='hidden md:flex space-x-8 text-gray-800 font-medium'
          role='menubar'
          aria-label='Main menu'
        >
          <li role='none'>
            <a 
              href='#home' 
              className='hover:text-[#3D7EF9] focus:text-[#3D7EF9] focus:outline-none focus:ring-2 focus:ring-[#3D7EF9] focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
              aria-label={`Navigate to ${t('home')} section`}
            >
              {t('home')}
            </a>
          </li>
          <li role='none'>
            <a 
              href='#features' 
              className='hover:text-[#3D7EF9] focus:text-[#3D7EF9] focus:outline-none focus:ring-2 focus:ring-[#3D7EF9] focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
              aria-label={`Navigate to ${t('features')} section`}
            >
              {t('features')}
            </a>
          </li>
          <li role='none'>
            <a 
              href='#download' 
              className='hover:text-[#3D7EF9] focus:text-[#3D7EF9] focus:outline-none focus:ring-2 focus:ring-[#3D7EF9] focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
              aria-label={`Navigate to ${t('download')} section`}
            >
              {t('download')}
            </a>
          </li>
          <li role='none'>
            <a 
              href='#contact' 
              className='hover:text-[#3D7EF9] focus:text-[#3D7EF9] focus:outline-none focus:ring-2 focus:ring-[#3D7EF9] focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
              aria-label={`Navigate to ${t('contact')} section`}
            >
              {t('contact')}
            </a>
          </li>
          <li role='none'>
            <LanguageSwitcher />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderSection;

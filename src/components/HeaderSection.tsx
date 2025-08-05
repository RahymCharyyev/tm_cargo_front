import { getI18n } from '@/locales/server';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

const HeaderSection = async () => {
  const t = await getI18n();

  return (
    <header className='fixed top-0 w-full bg-white/95 backdrop-blur z-50 transition-all'>
      <nav className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Image
            width={48}
            height={48}
            className='w-12'
            src='/icon.png'
            alt='TmCargo icon'
          />
          <div className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D7EF9] to-[#2B529B]'>
            TmCargo
          </div>
        </div>
        <ul className='hidden md:flex space-x-8 text-gray-800 font-medium'>
          <li>
            <a href='#home' className='hover:text-[#3D7EF9]'>
              {t('home')}
            </a>
          </li>
          <li>
            <a href='#features' className='hover:text-[#3D7EF9]'>
              {t('features')}
            </a>
          </li>
          <li>
            <a href='#download' className='hover:text-[#3D7EF9]'>
              {t('download')}
            </a>
          </li>
          <li>
            <a href='#contact' className='hover:text-[#3D7EF9]'>
              {t('contact')}
            </a>
          </li>
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderSection;

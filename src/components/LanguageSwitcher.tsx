'use client';

import { useChangeLocale } from '@/locales/client';

const LanguageSwitcher = () => {
  const changeLocale = useChangeLocale();

  return (
    <div className='space-x-2'>
      <button className='cursor-pointer' onClick={() => changeLocale('ru')}>
        🇷🇺
      </button>
      <button className='cursor-pointer' onClick={() => changeLocale('tk')}>
        🇹🇲
      </button>
      <button className='cursor-pointer' onClick={() => changeLocale('en')}>
        🇺🇸
      </button>
    </div>
  );
};

export default LanguageSwitcher;

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const locales = ['en', 'ru', 'tk'];

  const changeLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const segments = pathname.split('/');
    if (locales.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.unshift('', newLocale);
    }

    const newPath = segments.join('/');
    router.replace(newPath);
  };

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

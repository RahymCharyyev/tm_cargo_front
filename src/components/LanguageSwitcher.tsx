'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const locales = [
    { code: 'ru', flag: '🇷🇺' },
    { code: 'tk', flag: '🇹🇲' },
    { code: 'en', flag: '🇺🇸' },
  ];

  const changeLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const segments = pathname.split('/');
    if (locales.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.unshift('', newLocale);
    }

    const newPath = segments.join('/');
    router.replace(newPath);
  };

  return (
    <div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1'>
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => changeLocale(locale.code)}
          className={`px-3 py-1.5 rounded-md text-lg transition-all duration-200 ${
            currentLocale === locale.code
              ? 'bg-[#3D7EF9] text-white shadow-md scale-105'
              : 'hover:bg-gray-200 text-gray-600 hover:scale-105'
          }`}
          title={locale.code.toUpperCase()}
        >
          {locale.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

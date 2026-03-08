'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const locales = [
  { code: 'ru', flag: '🇷🇺' },
  { code: 'tk', flag: '🇹🇲' },
  { code: 'en', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    const segments = pathname.split('/');
    if (locales.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.unshift('', newLocale);
    }
    router.replace(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => changeLocale(locale.code)}
          className={`px-2.5 py-1 rounded-md text-base transition-all duration-200 ${
            currentLocale === locale.code
              ? 'bg-[#3D7EF9] text-white shadow-sm scale-105'
              : 'hover:bg-gray-200 text-gray-600'
          }`}
          title={locale.code.toUpperCase()}
        >
          {locale.flag}
        </button>
      ))}
    </div>
  );
}

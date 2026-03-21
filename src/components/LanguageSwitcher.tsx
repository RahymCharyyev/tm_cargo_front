'use client';

import { Segmented } from 'antd';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const locales = [
  { code: 'ru', label: '🇷🇺 RU' },
  { code: 'tk', label: '🇹🇲 TK' },
  { code: 'en', label: '🇺🇸 EN' },
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
    <Segmented
      value={currentLocale}
      onChange={(val) => changeLocale(val as string)}
      options={locales.map((l) => ({ value: l.code, label: l.label }))}
      size="small"
    />
  );
}

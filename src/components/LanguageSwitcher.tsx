'use client';

import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const locales = [
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'tk', label: 'Türkmençe', short: 'TK' },
  { code: 'en', label: 'English', short: 'EN' },
] as const;

type Variant = 'navbar' | 'drawer' | 'glass';

export default function LanguageSwitcher({ variant = 'navbar' }: { variant?: Variant }) {
  const tNav = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    router.replace(pathname, { locale: newLocale });
  };

  const current = locales.find((l) => l.code === currentLocale) ?? locales[0];

  const menuItems: MenuProps['items'] = locales.map((l) => ({
    key: l.code,
    label: (
      <span className='flex items-center justify-between gap-6 min-w-[140px]'>
        <span className='font-medium text-slate-800'>{l.label}</span>
        <span className='text-xs font-semibold tabular-nums text-slate-400'>
          {l.short}
        </span>
      </span>
    ),
    className: l.code === currentLocale ? '!bg-blue-50' : undefined,
  }));

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    changeLocale(key);
  };

  if (variant === 'drawer') {
    return (
      <div>
        <p className='mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
          {tNav('language')}
        </p>
        <div className='flex rounded-xl border border-slate-200 bg-slate-100/90 p-1 gap-1'>
          {locales.map((l) => {
            const active = l.code === currentLocale;
            return (
              <button
                key={l.code}
                type='button'
                onClick={() => changeLocale(l.code)}
                className={`flex-1 rounded-lg py-2.5 text-center text-xs font-bold transition-all min-w-0 ${
                  active
                    ? 'bg-white text-[#1e3a8a] shadow-sm ring-1 ring-slate-200/80'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                <span className='block leading-tight'>{l.short}</span>
                <span className='mt-0.5 block truncate px-0.5 text-[10px] font-medium opacity-80'>
                  {l.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'glass') {
    return (
      <Dropdown
        menu={{
          items: menuItems,
          onClick: onMenuClick,
          selectable: true,
          selectedKeys: [currentLocale],
        }}
        trigger={['click']}
        placement='bottomRight'
      >
        <button
          type='button'
          className='inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/20 hover:text-white focus:outline-none'
          aria-label='Language'
        >
          <GlobalOutlined className='text-sm' />
          <span className='tabular-nums'>{current.short}</span>
          <svg className='h-3 w-3 opacity-70' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </button>
      </Dropdown>
    );
  }

  /* navbar: compact dropdown */
  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: onMenuClick,
        selectable: true,
        selectedKeys: [currentLocale],
      }}
      trigger={['click']}
      placement='bottomRight'
    >
      <button
        type='button'
        className='inline-flex h-10 items-center gap-2 rounded-full border border-[#2B5399]/25 bg-white px-3.5 text-sm font-semibold text-[#214076] shadow-sm transition hover:border-[#2B5399]/45 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7EF9]/40'
        aria-label='Language'
      >
        <GlobalOutlined className='text-base text-[#2B5399]' />
        <span className='tabular-nums'>{current.short}</span>
        <svg
          className='h-3.5 w-3.5 text-slate-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          aria-hidden
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>
    </Dropdown>
  );
}

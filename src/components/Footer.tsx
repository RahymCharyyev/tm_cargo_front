'use client';

import { MailOutlined, PhoneOutlined, SafetyOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className='relative mt-auto  bg-white text-slate-800 shadow-[0_-1px_0_0_rgba(28,53,96,0.06)]'>
      <div className='h-1 w-full   ' aria-hidden />

      <div className='mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14'>
        <div className='grid gap-12 lg:grid-cols-12 lg:gap-10'>
          {/* Бренд */}
          <div className='lg:col-span-5'>
            <div className='mb-5 flex items-center gap-3'>
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50'>
                <Image
                  width={36}
                  height={36}
                  className='h-9 w-9 object-contain'
                  src='/icon.webp'
                  alt=''
                />
              </div>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3D7EF9]'>
                  {t('brandTagline')}
                </p>
                <h2 className='text-xl font-bold tracking-tight text-[#1c3560]'>
                  Cargo TM
                </h2>
              </div>
            </div>
            <p className='max-w-md text-sm leading-relaxed text-slate-600'>
              {t('description')}
            </p>
          </div>

          {/* Контакты */}
          <div className='lg:col-span-4'>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>
              {t('contacts')}
            </h3>
            <ul className='space-y-1'>
              <li>
                <a
                  href='mailto:tm-cargo@sanly.tm'
                  className='group inline-flex items-center gap-2.5 rounded-lg py-2 text-sm text-slate-700 transition hover:text-[#1c3560]'
                >
                  <MailOutlined className='text-[#3D7EF9] transition group-hover:scale-105' />
                  <span className='border-b border-transparent group-hover:border-[#3D7EF9]/40'>
                    tm-cargo@sanly.tm
                  </span>
                </a>
              </li>
              <li>
                <a
                  href='tel:+99365607799'
                  className='group inline-flex items-center gap-2.5 rounded-lg py-2 text-sm text-slate-700 transition hover:text-[#1c3560]'
                >
                  <PhoneOutlined className='text-[#3D7EF9] transition group-hover:scale-105' />
                  <span className='border-b border-transparent group-hover:border-[#3D7EF9]/40 tabular-nums'>
                    +993 65 60 77 99
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div className='lg:col-span-3'>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>
              {t('support')}
            </h3>
            <Link
              href='/privacy-policy'
              className='group inline-flex items-center gap-2.5 rounded-lg py-2 text-sm font-medium text-slate-700 transition hover:text-[#1c3560]'
            >
              <SafetyOutlined className='text-emerald-600/80 transition group-hover:scale-105' />
              <span className='inline-flex items-center gap-1 border-b border-transparent group-hover:border-emerald-600/30'>
                {t('privacyPolicy')}
                <svg
                  className='h-3.5 w-3.5 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className='mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center'>
          <p className='text-xs text-slate-500'>
            &copy; {new Date().getFullYear()} Cargo TM. {t('rights')}
          </p>
          <p className='text-xs font-medium tabular-nums text-slate-400'>
            tm-cargo.com.tm
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function AuthFieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className='block text-[11px] font-semibold  tracking-[0.14em] text-slate-500'>
      {children}
    </span>
  );
}

export type AuthSplitShellProps = {
  formTitle: string;
  heroTitle: string;
  heroSubtitle?: string;
  showHeroLine?: boolean;
  showHeroOverlay?: boolean;
  showHeroText?: boolean;
  formPaneClassName?: string;
  children: ReactNode;
  footer?: ReactNode;
  showTrustBar?: boolean;
  termsFooter?: ReactNode;
};

function AuthGlassHeader() {
  const t = useTranslations('nav');

  return (
    <header className='absolute top-0 left-0 right-0 z-30'>
      <div
        className='mx-3 mt-3 rounded-2xl border border-white/20 px-4 py-3 sm:mx-5 sm:mt-4 sm:px-6'
        style={{
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.42) 0%, rgba(15,23,42,0.28) 100%)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          boxShadow:
            '0 10px 36px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.14)',
        }}
      >
        <div className='flex items-center justify-between gap-6'>
          <Link href='/' className='shrink-0'>
            <Image
              width={80}
              height={40}
              className='w-[70px] h-[35px] sm:w-[80px] sm:h-[40px] object-contain brightness-0 invert'
              src='/icon.svg'
              alt='TM CARgo'
            />
          </Link>

          <nav className='hidden sm:flex items-center gap-1 ml-auto'>
            <Link
              href='/'
              className='flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[16px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white'
            >
              <svg
                className='w-3.5 h-3.5 opacity-80'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
              {t('homeLink')}
            </Link>
            <a
              href='/download'
              className='flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[16px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white'
            >
              <Image
                src='/Arrow Download.svg'
                alt=''
                width={14}
                height={14}
                className='opacity-80 brightness-0 invert'
              />
              {t('downloadApp')}
            </a>
            <LanguageSwitcher variant='glass' />
          </nav>
        </div>
      </div>
    </header>
  );
}

export function AuthSplitShell({
  formTitle,
  heroTitle,
  heroSubtitle,
  showHeroLine = true,
  showHeroOverlay = true,
  showHeroText = true,
  formPaneClassName,
  children,
  footer,
  termsFooter,
}: AuthSplitShellProps) {
  return (
    <div className='flex min-h-dvh flex-col lg:flex-row'>
      {/* Left — hero */}
      <div className='relative h-52 shrink-0 sm:h-64 lg:h-auto lg:min-h-dvh lg:w-1/2'>
        <Image
          src='/truck_login.webp'
          alt=''
          fill
          priority
          className='object-cover'
          sizes='(max-width: 1024px) 100vw, 50vw'
        />
        {showHeroOverlay && (
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/75 to-slate-800/50' />
        )}

        <AuthGlassHeader />

        {showHeroText && (
          <div className='absolute inset-0 flex flex-col justify-end p-6 pb-8 sm:p-8 lg:p-12 lg:pb-16'>
            <h2 className='max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl xl:text-[2.75rem] xl:leading-[1.1]'>
              {heroTitle}
            </h2>
            {showHeroLine && (
              <div className='mt-5 h-1 w-14 rounded-full bg-white sm:mt-6 sm:w-16' />
            )}
            {heroSubtitle ? (
              <p className='mt-4 hidden max-w-md text-sm leading-relaxed text-white/85 lg:block'>
                {heroSubtitle}
              </p>
            ) : null}
          </div>
        )}
      </div>

      {/* Right — form */}
      <div
        className={`flex flex-1 flex-col bg-[#EDF3FB] lg:w-1/2 lg:bg-white ${formPaneClassName ?? ''}`.trim()}
      >
        <div className='flex flex-1 flex-col justify-center px-5 py-10 sm:px-8 lg:px-14 lg:py-14 xl:px-20'>
          <div className='mx-auto w-full max-w-md'>
            <h1 className='mb-8 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl'>
              {formTitle}
            </h1>

            <div className='auth-split-form'>{children}</div>

            {footer ? <div className='mt-8'>{footer}</div> : null}

            {termsFooter ? (
              <p className='mt-10 text-center text-xs leading-relaxed text-slate-500'>
                {termsFooter}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

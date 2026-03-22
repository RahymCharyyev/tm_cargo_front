'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

export function AuthFieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className='block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
      {children}
    </span>
  );
}

export type AuthSplitShellProps = {
  formTitle: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle?: string;
  showHeroLine?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  showTrustBar?: boolean;
  termsFooter?: ReactNode;
};

export function AuthSplitShell({
  formTitle,
  heroKicker,
  heroTitle,
  heroSubtitle,
  showHeroLine = true,
  children,
  footer,
  showTrustBar = true,
  termsFooter,
}: AuthSplitShellProps) {
  return (
    <div className='flex min-h-dvh flex-col lg:flex-row'>
      {/* Left — hero */}
      <div className='relative h-52 shrink-0 sm:h-64 lg:h-auto lg:min-h-dvh lg:w-1/2'>
        <Image
          src='/truck.webp'
          alt=''
          fill
          priority
          className='object-cover'
          sizes='(max-width: 1024px) 100vw, 50vw'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/75 to-slate-800/50' />
        <div className='absolute inset-0 flex flex-col justify-end p-6 pb-8 sm:p-8 lg:p-12 lg:pb-16'>
          <p className='mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-sky-200/90 sm:text-[11px]'>
            {heroKicker}
          </p>
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
      </div>

      {/* Right — form */}
      <div className='flex flex-1 flex-col bg-[#EDF3FB] lg:w-1/2 lg:bg-white'>
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
        </div>{' '}
      </div>
    </div>
  );
}

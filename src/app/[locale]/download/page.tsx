'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';

const DEFAULT_ANDROID_URL =
  'https://play.google.com/store/apps/details?id=tm.com.cargotm';
const DEFAULT_IOS_URL = 'https://apps.apple.com/us/app/cargo-tm/id6748551361';

const pageText: Record<
  string,
  { title: string; description: string; auto: string; manual: string }
> = {
  ru: {
    title: 'Ссылка на приложение',
    description: 'Одна универсальная ссылка для установки приложения.',
    auto: 'Определяем ваше устройство и перенаправляем...',
    manual: 'Если переход не произошёл — выберите платформу:',
  },
  en: {
    title: 'App Smart Link',
    description: 'One universal link to install the app.',
    auto: 'Detecting your device and redirecting...',
    manual: 'If redirect did not start, choose your platform:',
  },
  tk: {
    title: 'Programmanyň salgysy',
    description: 'Programmanyň gurnalmagy üçin bir umumy smart link.',
    auto: 'Enjamyňyz kesgitlenýär we ugrukdyrylýar...',
    manual: 'Geçiş bolmasa, platformany saýlaň:',
  },
};

export default function TaplinkPage() {
  const locale = useLocale();
  const text = pageText[locale] || pageText.ru;
  const [redirecting, setRedirecting] = useState(false);

  const androidUrl =
    process.env.NEXT_PUBLIC_ANDROID_APP_URL || DEFAULT_ANDROID_URL;
  const iosUrl = process.env.NEXT_PUBLIC_IOS_APP_URL || DEFAULT_IOS_URL;

  const targetUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return iosUrl;
    if (/android/.test(ua)) return androidUrl;
    return '';
  }, [androidUrl, iosUrl]);

  useEffect(() => {
    if (!targetUrl) return;
    setRedirecting(true);
    const timer = window.setTimeout(() => {
      window.location.href = targetUrl;
    }, 900);
    return () => window.clearTimeout(timer);
  }, [targetUrl]);

  return (
    <div className='min-h-[70vh] bg-[#d6e1ef]'>
      <div className='max-w-[1470px] mx-auto px-4 py-10'>
        <div className='mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm border border-gray-200 text-center'>
          <h1 className='text-3xl font-semibold text-[#1f3d6b]'>
            {text.title}
          </h1>
          <p className='mt-3 text-gray-600'>{text.description}</p>
          {redirecting ? (
            <p className='mt-3 text-sm text-[#2f569d]'>{text.auto}</p>
          ) : null}

          <p className='mt-6 text-sm text-gray-500'>{text.manual}</p>

          <div className='mt-4 flex flex-col sm:flex-row items-center justify-center gap-3'>
            <a
              href={iosUrl}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center rounded-xl border border-[#2f569d] bg-white px-4 py-2 hover:bg-slate-50 transition-colors'
            >
              <Image
                src='/app_store.png'
                alt='Download on App Store'
                width={150}
                height={46}
              />
            </a>
            <a
              href={androidUrl}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center rounded-xl border border-[#2f569d] bg-white px-4 py-2 hover:bg-slate-50 transition-colors'
            >
              <Image
                src='/google_play.png'
                alt='Get it on Google Play'
                width={150}
                height={46}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

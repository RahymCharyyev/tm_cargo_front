import GoogleAnalytics from '@/components/GoogleAnalytics';
import YandexMetrika from '@/components/YandexMetrika';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactElement } from 'react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metadataByLocale: Record<string, Metadata> = {
    ru: {
      title: 'TM Cargo — Грузоперевозки по всей Азии',
      description:
        'TM Cargo — платформа для быстрого поиска и размещения грузов и транспорта по всей Азии. Надежные перевозки и удобный сервис.',
      keywords: [
        'груз',
        'транспорт',
        'перевозка',
        'Туркменистан',
        'tm cargo',
        'логистика',
      ],
      // openGraph: {
      //   locale: 'ru_RU',
      //   title: 'TM Cargo — Грузоперевозки по всей Азии',
      //   description: 'Разместите груз или найдите транспорт в пару кликов.',
      //   url: 'https://tm-cargo.com.tm/',
      //   type: 'website',
      //   images: [
      //     {
      //       url: 'https://tm-cargo.com.tm/icon.png',
      //       width: 1200,
      //       height: 630,
      //       alt: 'TM Cargo',
      //     },
      //   ],
      // },
      // twitter: {
      //   card: 'summary_large_image',
      //   title: 'TM Cargo',
      //   description: 'Платформа для грузоперевозок по всей Азии',
      //   images: ['https://tm-cargo.com.tm/icon.png'],
      // },
    },
    en: {
      title: 'TM Cargo — Cargo and Transport Services Across Asia',
      description:
        'TM Cargo — a platform for quick cargo and transport search and posting across Asia. Reliable logistics and user-friendly service.',
      keywords: [
        'cargo',
        'transport',
        'logistics',
        'Turkmenistan',
        'tm cargo',
        'shipping',
      ],
      // openGraph: {
      //   locale: 'en_US',
      //   title: 'TM Cargo — Cargo and Transport Services Across Asia',
      //   description: 'Post cargo or find transport in just a few clicks.',
      //   url: 'https://tm-cargo.com.tm/',
      //   type: 'website',
      //   images: [
      //     {
      //       url: 'https://tm-cargo.com.tm/icon.png',
      //       width: 1200,
      //       height: 630,
      //       alt: 'TM Cargo',
      //     },
      //   ],
      // },
      // twitter: {
      //   card: 'summary_large_image',
      //   title: 'TM Cargo',
      //   description: 'Platform for cargo and transport services across Asia',
      //   images: ['https://tm-cargo.com.tm/icon.png'],
      // },
    },
    tk: {
      title: 'TM Cargo — Aziýa boýunça ýük we ulag hyzmatlary',
      description:
        'TM Cargo — Aziýa boýunça ýük we ulag tapmak we ýerleşdirmek üçin platforma. Ygtybarly logistika we ulanyjy üçin amatly hyzmat.',
      keywords: [
        'ýük',
        'ulag',
        'logistika',
        'Türkmenistan',
        'tm cargo',
        'daşamak',
      ],
      // openGraph: {
      //   locale: 'tk_TM',
      //   title: 'TM Cargo — Aziýa boýunça ýük we ulag hyzmatlary',
      //   description: 'Ýük ýerleşdiriň ýa-da birnäçe basmak bilen ulag tapyň.',
      //   url: 'https://tm-cargo.com.tm/',
      //   type: 'website',
      //   images: [
      //     {
      //       url: 'https://tm-cargo.com.tm/icon.png',
      //       width: 1200,
      //       height: 630,
      //       alt: 'TM Cargo',
      //     },
      //   ],
      // },
      // twitter: {
      //   card: 'summary_large_image',
      //   title: 'TM Cargo',
      //   description: 'Aziýa boýunça ýük we ulag hyzmatlary üçin platforma',
      //   images: ['https://tm-cargo.com.tm/icon.png'],
      // },
    },
  };

  const selectedMetadata = metadataByLocale[locale] || metadataByLocale.ru;

  return {
    ...selectedMetadata,
    robots: 'index, follow',
    icons: {
      icon: '/favicon.ico',
      apple: '/icon.png',
    },
    // manifest: '/site.webmanifest',
    // alternates: {
    //   canonical: 'https://tm-cargo.com.tm/',
    // },
  };
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactElement;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          {children}
          <YandexMetrika />
          <GoogleAnalytics ga_id={'G-F2PJ29HX1B'} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

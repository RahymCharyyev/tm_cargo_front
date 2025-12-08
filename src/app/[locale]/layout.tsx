import GoogleAnalytics from '@/components/GoogleAnalytics';
import YandexMetrika from '@/components/YandexMetrika';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metadataByLocale: Record<string, Metadata> = {
    ru: {
      title: 'Cargo TM — Грузоперевозки по всей Азии',
      description:
        'Cargo TM — платформа для быстрого поиска и размещения грузов и транспорта по всей Азии. Надежные перевозки и удобный сервис.',
      keywords: [
        'груз',
        'транспорт',
        'перевозка',
        'Туркменистан',
        'cargo tm',
        'логистика',
      ],
    },
    en: {
      title: 'Cargo TM — Cargo and Transport Services Across Asia',
      description:
        'Cargo TM — a platform for quick cargo and transport search and posting across Asia. Reliable logistics and user-friendly service.',
      keywords: [
        'cargo',
        'transport',
        'logistics',
        'Turkmenistan',
        'cargo tm',
        'shipping',
      ],
    },
    tk: {
      title: 'Cargo TM — Aziýa boýunça ýük we ulag hyzmatlary',
      description:
        'Cargo TM — Aziýa boýunça ýük we ulag tapmak we ýerleşdirmek üçin platforma. Ygtybarly logistika we ulanyjy üçin amatly hyzmat.',
      keywords: [
        'ýük',
        'ulag',
        'logistika',
        'Türkmenistan',
        'cargo tm',
        'daşamak',
      ],
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
  };
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
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

import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Navbar from '@/components/Navbar';
import YandexMetrika from '@/components/YandexMetrika';
import { routing } from '@/i18n/routing';
import { Providers } from '@/lib/providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import './globals.css';

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
        'Cargo TM — платформа для быстрого поиска и размещения грузов и транспорта по всей Азии.',
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
        'Cargo TM — a platform for quick cargo and transport search and posting across Asia.',
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
        'Cargo TM — Aziýa boýunça ýük we ulag tapmak we ýerleşdirmek üçin platforma.',
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
      apple: '/icon.webp',
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
      <body className={`font-sans antialiased bg-[#E8F2FF]`}>
        <GoogleAnalytics />
        <YandexMetrika />
        <NextIntlClientProvider>
          <AntdRegistry>
            <Providers locale={locale}>
              <Navbar />
              <main className='min-h-screen'>{children}</main>
              <Footer />
            </Providers>
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

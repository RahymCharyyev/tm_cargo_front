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

  const baseUrl = 'https://tm-cargo.com.tm';
  const currentUrl = `${baseUrl}/${locale === 'tk' ? '' : locale}`;

  const metadataByLocale: Record<string, Metadata> = {
    ru: {
      title: 'TM Cargo — Грузоперевозки по всей Азии | Логистическая платформа',
      description:
        'TM Cargo — надежная платформа для быстрого поиска и размещения грузов и транспорта по всей Азии. Эффективная логистика, безопасные перевозки и удобный сервис для вашего бизнеса.',
      keywords: [
        'грузоперевозки',
        'логистика',
        'транспорт',
        'груз',
        'Туркменистан',
        'Азия',
        'tm cargo',
        'доставка',
        'перевозка товаров',
        'транспортная компания',
        'международные перевозки',
        'логистические услуги'
      ],
      authors: [{ name: 'TM Cargo Team' }],
      creator: 'TM Cargo',
      publisher: 'TM Cargo',
      applicationName: 'TM Cargo',
      category: 'Business',
      classification: 'Logistics and Transportation',
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: currentUrl,
        siteName: 'TM Cargo',
        title: 'TM Cargo — Грузоперевозки по всей Азии',
        description: 'Разместите груз или найдите транспорт в пару кликов. Надежная логистическая платформа для всей Азии.',
        images: [
          {
            url: `${baseUrl}/icon.png`,
            width: 1200,
            height: 630,
            alt: 'TM Cargo - Логистическая платформа',
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@tmcargo',
        creator: '@tmcargo',
        title: 'TM Cargo — Грузоперевозки по всей Азии',
        description: 'Надежная платформа для грузоперевозок и логистики в Азии',
        images: [`${baseUrl}/icon.png`],
      },
    },
    en: {
      title: 'TM Cargo — Cargo and Transport Services Across Asia | Logistics Platform',
      description:
        'TM Cargo — reliable platform for quick cargo and transport search and posting across Asia. Efficient logistics, secure shipping, and user-friendly service for your business.',
      keywords: [
        'cargo shipping',
        'logistics',
        'transport',
        'freight',
        'Turkmenistan',
        'Asia',
        'tm cargo',
        'delivery',
        'goods transportation',
        'transport company',
        'international shipping',
        'logistics services'
      ],
      authors: [{ name: 'TM Cargo Team' }],
      creator: 'TM Cargo',
      publisher: 'TM Cargo',
      applicationName: 'TM Cargo',
      category: 'Business',
      classification: 'Logistics and Transportation',
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: currentUrl,
        siteName: 'TM Cargo',
        title: 'TM Cargo — Cargo and Transport Services Across Asia',
        description: 'Post cargo or find transport in just a few clicks. Reliable logistics platform for all of Asia.',
        images: [
          {
            url: `${baseUrl}/icon.png`,
            width: 1200,
            height: 630,
            alt: 'TM Cargo - Logistics Platform',
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@tmcargo',
        creator: '@tmcargo',
        title: 'TM Cargo — Cargo and Transport Services Across Asia',
        description: 'Reliable platform for cargo shipping and logistics in Asia',
        images: [`${baseUrl}/icon.png`],
      },
    },
    tk: {
      title: 'TM Cargo — Aziýa boýunça ýük we ulag hyzmatlary | Logistika platformasy',
      description:
        'TM Cargo — Aziýa boýunça ýük we ulag tapmak we ýerleşdirmek üçin ygtybarly platforma. Netijeli logistika, howpsuz daşamak we işiňiz üçin amatly hyzmat.',
      keywords: [
        'ýük daşamak',
        'logistika',
        'ulag',
        'ýük',
        'Türkmenistan',
        'Aziýa',
        'tm cargo',
        'eltip bermek',
        'haryt daşamak',
        'transport kompaniýasy',
        'halkara daşamak',
        'logistika hyzmatlary'
      ],
      authors: [{ name: 'TM Cargo Team' }],
      creator: 'TM Cargo',
      publisher: 'TM Cargo',
      applicationName: 'TM Cargo',
      category: 'Business',
      classification: 'Logistics and Transportation',
      openGraph: {
        type: 'website',
        locale: 'tk_TM',
        url: currentUrl,
        siteName: 'TM Cargo',
        title: 'TM Cargo — Aziýa boýunça ýük we ulag hyzmatlary',
        description: 'Ýük ýerleşdiriň ýa-da birnäçe basmak bilen ulag tapyň. Aziýanyň ähli ýeri üçin ygtybarly logistika platformasy.',
        images: [
          {
            url: `${baseUrl}/icon.png`,
            width: 1200,
            height: 630,
            alt: 'TM Cargo - Logistika platformasy',
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@tmcargo',
        creator: '@tmcargo',
        title: 'TM Cargo — Aziýa boýunça ýük we ulag hyzmatlary',
        description: 'Aziýada ýük daşamak we logistika üçin ygtybarly platforma',
        images: [`${baseUrl}/icon.png`],
      },
    },
  };

  const selectedMetadata = metadataByLocale[locale] || metadataByLocale.tk;

  return {
    ...selectedMetadata,
    metadataBase: new URL(baseUrl),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      ],
      apple: [
        { url: '/icon.png', sizes: '180x180', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      other: [
        { rel: 'mask-icon', url: '/favicon.svg', color: '#3D7EF9' },
      ],
    },
    manifest: '/site.webmanifest',
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'ru': `${baseUrl}/ru`,
        'tk': `${baseUrl}`,
        'x-default': `${baseUrl}`,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
      yandex: 'your-yandex-verification-code', // Replace with actual verification code
    },
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

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TM Cargo",
    "url": `https://tm-cargo.com.tm/${locale === 'tk' ? '' : locale}`,
    "logo": "https://tm-cargo.com.tm/icon.png",
    "description": locale === 'ru' 
      ? "Надежная платформа для грузоперевозок и логистики в Азии"
      : locale === 'en'
      ? "Reliable platform for cargo shipping and logistics in Asia"
      : "Aziýada ýük daşamak we logistika üçin ygtybarly platforma",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Russian", "Turkmen"]
    },
    "areaServed": {
      "@type": "Place",
      "name": "Asia"
    },
    "serviceType": [
      "Cargo Transportation",
      "Logistics Services",
      "Freight Forwarding"
    ],
    "applicationCategory": "BusinessApplication",
    "operatingSystem": ["Android", "iOS"],
    "offers": {
      "@type": "Offer",
      "description": locale === 'ru'
        ? "Бесплатное мобильное приложение для грузоперевозок"
        : locale === 'en'
        ? "Free mobile application for cargo transportation"
        : "Ýük daşamak üçin mugt mobil programma",
      "price": "0",
      "priceCurrency": "USD"
    },
    "sameAs": [
      "https://apps.apple.com/tm/app/tmcargo/id6748551361"
    ]
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
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

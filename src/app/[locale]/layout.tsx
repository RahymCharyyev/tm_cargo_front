/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
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

export const metadata: Metadata = {
  title: 'TM Cargo — Грузоперевозки по всей Азии',
  description:
    'Платформа для поиска и размещения грузов и транспорта по всей Азии.',
  keywords: [
    'груз',
    'транспорт',
    'перевозка',
    'Туркменистан',
    'tm cargo',
    'логистика',
  ],
  robots: 'index, follow',
  openGraph: {
    locale: 'ru_RU',
    title: 'TM Cargo — Грузоперевозки по всей Азии',
    description: 'Разместите груз или найдите транспорт в пару кликов.',
    url: 'https://tm-cargo.com.tm/',
    type: 'website',
    images: [
      {
        url: 'https://tm-cargo.com.tm/icon.png',
        width: 1200,
        height: 630,
        alt: 'TM Cargo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TM Cargo',
    description: 'Платформа для грузоперевозок по всей Азии',
    images: ['https://tm-cargo.com.tm/icon.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://tm-cargo.com.tm/',
  },
  verification: {
    yandex: '5e9250af52b7db4a',
    google: 'brX0_hHSyI_hVZs3Mk_MRcI51R3EK9QPo2XTcxc7htU',
  },
};

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactElement;
}) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Yandex Metrika Script */}
        <Script id='yandex-metrika' strategy='afterInteractive'>
          {`
            (function (m, e, t, r, i, k, a) {
              m[i] =
                m[i] ||
                function () {
                  (m[i].a = m[i].a || []).push(arguments);
                };
              m[i].l = 1 * new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) {
                  return;
                }
              }
              (k = e.createElement(t)),
                (a = e.getElementsByTagName(t)[0]),
                (k.async = 1),
                (k.src = r),
                a.parentNode.insertBefore(k, a);
            })(
              window,
              document,
              'script',
              'https://mc.yandex.ru/metrika/tag.js',
              'ym'
            );

            ym(103419917, 'init', {
              webvisor: true,
              clickmap: true,
              accurateTrackBounce: true,
              trackLinks: true,
            });
          `}
        </Script>

        <Script
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=G-F2PJ29HX1B'
        />

        {/* Google Analytics: config */}
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F2PJ29HX1B');
          `}
        </Script>

        {/* Yandex Metrika <noscript> fallback */}
        <noscript>
          <div>
            <img
              src='https://mc.yandex.ru/watch/103419917'
              style={{ position: 'absolute', left: '-9999px' }}
              alt=''
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}

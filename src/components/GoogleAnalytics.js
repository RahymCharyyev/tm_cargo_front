'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function GoogleAnalyticsInner({ ga_id }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ga_id || !pathname) return;
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', ga_id, {
        page_path: url,
      });
    }
  }, [ga_id, pathname, searchParams]);

  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
      />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga_id}', {
              page_path: window.location.pathname + window.location.search,
            });
          `,
        }}
      />
    </>
  );
}

export default function GoogleAnalytics() {
  const ga_id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  if (!ga_id) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner ga_id={ga_id} />
    </Suspense>
  );
}

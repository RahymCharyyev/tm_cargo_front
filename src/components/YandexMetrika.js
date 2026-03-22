'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import ym, { YMInitializer } from 'react-yandex-metrika';

function YandexMetrikaInner({ counterId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!counterId || !pathname) return;
    const qs = searchParams?.toString();
    const url = pathname + (qs ? `?${qs}` : '');
    ym('hit', url);
  }, [counterId, pathname, searchParams]);

  return (
    <YMInitializer
      accounts={[counterId]}
      options={{
        defer: true,
        webvisor: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      }}
      version='2'
    />
  );
}

export default function YandexMetrika() {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const counterId = raw ? Number.parseInt(String(raw).trim(), 10) : NaN;

  if (!Number.isFinite(counterId) || counterId <= 0) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <YandexMetrikaInner counterId={counterId} />
    </Suspense>
  );
}

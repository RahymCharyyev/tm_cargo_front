import { useEffect, useState } from 'react';

/**
 * Returns banner "type" based on viewport.
 * - desktop: >= 640px
 * - mobile: < 640px
 */
export function useBannerType(): 'desktop' | 'mobile' {
  const [type, setType] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setType(mq.matches ? 'mobile' : 'desktop');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return type;
}


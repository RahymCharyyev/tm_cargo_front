'use client';

import { useEffect } from 'react';

export default function ScrollAndHeaderEffect() {
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    const onScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 100) {
        header?.classList.add('shadow-lg');
      } else {
        header?.classList.remove('shadow-lg');
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}

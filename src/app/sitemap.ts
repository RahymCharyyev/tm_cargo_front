import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tm-cargo.com.tm';
  const currentDate = new Date();
  
  // Generate URLs for all locales
  const localeUrls: MetadataRoute.Sitemap = [];
  
  routing.locales.forEach((locale) => {
    const localePrefix = locale === 'tk' ? '' : `/${locale}`;
    
    // Main pages
    localeUrls.push(
      {
        url: `${baseUrl}${localePrefix}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}${localePrefix}/instruction`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}${localePrefix}/privacy-policy`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      }
    );
  });

  return localeUrls;
}
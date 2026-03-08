'use client';

import { useTranslations } from 'next-intl';
import { useListings, useBanners } from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const CATEGORIES = [
  { key: 'international', image: '/international.png', link: '/listings?locationType=international' },
  { key: 'withinTurkmenistan', image: '/inside_tm.png', link: '/listings?locationType=intercity' },
  { key: 'withinCityRegion', image: '/inside_city.png', link: '/listings?locationType=local' },
  { key: 'hitchhiking', image: '/hitchhiking.png', link: '/listings?type=traveler' },
  { key: 'parcels', image: '/package.png', link: '/listings?type=load' },
] as const;

export default function HomePage() {
  const t = useTranslations('home');
  const { data: banners } = useBanners();
  const { data: listings, isLoading } = useListings({
    page: 1,
    perPage: 4,
    sort: 'newest',
  });

  const topBanner = banners?.data?.find(b => b.location === 'top');

  return (
    <div className="min-h-screen bg-[#d6e1ef]">
      <div className="max-w-[1470px] mx-auto px-4 py-4">
        {/* Advertisement Banner */}
        <section className="mb-8">
          {topBanner ? (
            <a
              href={topBanner.link || '#'}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-xl overflow-hidden bg-gray-100"
            >
              <Image
                src={`https://tm-cargo.com.tm/api/${topBanner.image}`}
                alt={t('adBanner')}
                width={1200}
                height={280}
                className="w-full h-48 sm:h-56 object-cover"
                crossOrigin="anonymous"
              />
            </a>
          ) : (
            <div className="w-full rounded-3xl bg-[#dedede] flex items-center justify-center h-40 sm:h-48 text-gray-500 text-[38px] leading-none">
              {t('adBanner')}
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-[35px] leading-none font-semibold text-gray-900 mb-3">{t('viewByCategories')}</h2>
          <div className="flex flex-wrap justify-between gap-3 mb-4">
            <span className="flex items-center gap-2 text-[#6f7682] text-[27px] font-medium">
              <Image src="/Vehicle Truck Profile.svg" alt="" width={20} height={20} className="w-5 h-5" />
              {t('cargoTransport')}
            </span>
            <span className="flex items-center gap-2 text-[#6f7682] text-[27px] font-medium">
              <Image src="/Vehicle Car Profile.svg" alt="" width={20} height={20} className="w-5 h-5" />
              {t('smallTransport')}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={cat.link}
                className="relative bg-[#badbff] rounded-[28px] h-[142px] p-4 overflow-hidden hover:bg-[#a9d2ff] transition-colors shadow-sm"
              >
                <div className="absolute right-3 top-2 w-[88px] h-[72px] md:w-[98px] md:h-[80px]">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="absolute left-4 bottom-4 text-[18px] leading-[1.05] font-semibold text-[#171717] max-w-[65%]">
                  {t(cat.key)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[35px] leading-none font-semibold text-gray-900">{t('recentlyAdded')}</h2>
            <Link href="/listings" className="hidden md:inline-flex items-center gap-2 text-[30px] font-semibold text-[#2f4666] hover:underline">
              <Image src="/Apps List.svg" alt="" width={18} height={18} />
              {t('viewAll')}
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : listings?.data && listings.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {listings.data.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
              <p className="mb-4">No listings yet.</p>
              <Link href="/listings" className="text-[#3D7EF9] font-medium hover:underline">
                {t('viewAll')}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

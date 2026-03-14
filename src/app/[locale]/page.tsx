'use client';

import { useTranslations } from 'next-intl';
import { useListings, useBanners } from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const CATEGORIES = [
  {
    key: 'international',
    image: '/international.png',
    link: '/listings?locationType=international',
  },
  {
    key: 'withinTurkmenistan',
    image: '/inside_tm.png',
    link: '/listings?locationType=intercity',
  },
  {
    key: 'withinCityRegion',
    image: '/inside_city.png',
    link: '/listings?locationType=local',
  },
  {
    key: 'hitchhiking',
    image: '/hitchhiking.png',
    link: '/listings?type=traveler',
  },
  { key: 'parcels', image: '/package.png', link: '/listings?type=load' },
] as const;

export default function HomePage() {
  const t = useTranslations('home');
  const { data: banners } = useBanners();
  const { data: listings, isLoading } = useListings({
    page: 1,
    perPage: 16,
    sort: 'newest',
  });

  const topBanner = banners?.data?.find((b) => b.location === 'top');
  const middleBanner = banners?.data?.find(
    (b) => b.location === 'list' || b.location === 'inside',
  );
  const firstBlock = listings?.data?.slice(0, 8) ?? [];
  const secondBlock = listings?.data?.slice(8, 16) ?? [];

  return (
    <div className='min-h-screen bg-[#E8F2FF]'>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 py-4'>
        {/* Advertisement Banner */}
        <section className='mb-6'>
          {topBanner ? (
            <a
              href={topBanner.link || '#'}
              target='_blank'
              rel='noreferrer'
              className='block w-full rounded-[20px] sm:rounded-[30px] overflow-hidden bg-gray-100'
            >
              <Image
                src={`https://tm-cargo.com.tm/api/${topBanner.image}`}
                alt={t('adBanner')}
                width={1200}
                height={280}
                className='w-full h-[100px] sm:h-[140px] object-cover'
                crossOrigin='anonymous'
              />
            </a>
          ) : (
            <div className='w-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-b from-white to-[#FAFAFA] flex items-center justify-center h-[100px] sm:h-[140px] text-[#999] text-base'>
              {t('adBanner')}
            </div>
          )}
        </section>

        {/* Categories */}
        <section className='mb-8'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-[18px] sm:text-[20px] font-semibold text-gray-900'>
              {t('viewByCategories')}
            </h2>
            <div className='hidden sm:flex items-center gap-4'>
              <span className='flex items-center gap-1.5 text-[#6f7682] text-[14px] sm:text-[16px] font-medium'>
                <Image
                  src='/Vehicle Truck Profile.svg'
                  alt=''
                  width={24}
                  height={24}
                  className='w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]'
                />
                {t('cargoTransport')}
              </span>
              <span className='flex items-center gap-1.5 text-[#6f7682] text-[14px] sm:text-[16px] font-medium'>
                <Image
                  src='/Vehicle Car Profile.svg'
                  alt=''
                  width={24}
                  height={24}
                  className='w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]'
                />
                {t('smallTransport')}
              </span>
            </div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4'>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={cat.link}
                className='relative bg-gradient-to-b from-[#CCE5FF] to-[#ABD4FF] rounded-[20px] sm:rounded-[30px] h-[120px] sm:h-[140px] p-4 sm:p-5 overflow-hidden hover:brightness-95 transition-all'
              >
                <div className='absolute right-3 top-3 sm:right-4 sm:top-4 w-[70px] h-[50px] sm:w-[100px] sm:h-[64px]'>
                  <Image
                    src={cat.image}
                    alt=''
                    fill
                    className='object-contain'
                  />
                </div>
                <span className='absolute left-4 bottom-4 sm:left-5 sm:bottom-5 text-[13px] sm:text-[16px] leading-[1.2] font-semibold text-black max-w-[65%]'>
                  {t(cat.key)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <section>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <h2 className='text-[18px] sm:text-[20px] font-semibold text-gray-900'>
              {t('recentlyAdded')}
            </h2>
            <Link
              href='/listings'
              className='inline-flex items-center gap-1.5 text-[15px] sm:text-[18px] font-semibold text-[#2f4666] hover:underline'
            >
              <Image src='/Apps List.svg' alt='' width={14} height={14} />
              {t('viewAll')}
            </Link>
          </div>
          {isLoading ? (
            <div className='flex justify-center py-12'>
              <LoadingSpinner />
            </div>
          ) : firstBlock.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px]'>
                {firstBlock.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Реклама 2 */}
              <section className='my-8'>
                {middleBanner ? (
                  <a
                    href={middleBanner.link || '#'}
                    target='_blank'
                    rel='noreferrer'
                    className='block w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm'
                  >
                    <Image
                      src={`https://tm-cargo.com.tm/api/${middleBanner.image}`}
                      alt={t('adBanner2')}
                      width={1200}
                      height={280}
                      className='w-full h-40 sm:h-48 object-cover'
                      crossOrigin='anonymous'
                    />
                  </a>
                ) : (
                  <div className='w-full rounded-[30px] bg-gradient-to-b from-white to-[#FAFAFA] flex items-center justify-center h-[140px] text-[#999] text-base'>
                    {t('adBanner2')}
                  </div>
                )}
              </section>

              {secondBlock.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px] mt-6'>
                  {secondBlock.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className='bg-gray-50 rounded-xl p-8 text-center text-gray-500'>
              <p className='mb-4'>No listings yet.</p>
              <Link
                href='/listings'
                className='text-[#3D7EF9] font-medium hover:underline'
              >
                {t('viewAll')}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

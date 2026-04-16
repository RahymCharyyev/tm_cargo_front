'use client';

import { useTranslations } from 'next-intl';
import { useListings, useBanners } from '@/lib/hooks';
import { useBannerType } from '@/lib/useBannerType';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const CATEGORIES = [
  {
    key: 'international',
    image: '/tm_cargo.svg',
    secondaryImage: '/ball.svg',
    bgClass: 'bg-gradient-to-br from-[#67B2FF] to-[#2990FF]',
    link: '/listings?locationType=international',
  },
  {
    key: 'withinTurkmenistan',
    image: '/inside_tm.svg',
    bgClass: 'bg-gradient-to-br from-[#63E856] to-[#2EC73A]',
    link: '/listings?locationType=intercity',
  },
  {
    key: 'withinCityRegion',
    image: '/local.svg',
    bgClass: 'bg-gradient-to-br from-[#6A70FF] to-[#4B43FF]',
    link: '/listings?locationType=local',
  },
  {
    key: 'hitchhiking',
    image: '/hitchiking.svg',
    secondaryImage: '/people.svg',
    bgClass: 'bg-gradient-to-br from-[#FFC34B] to-[#F7B218]',
    link: '/listings?type=traveler',
  },
  {
    key: 'parcels',
    image: '/package.svg',
    secondaryImage: '/package_1.svg',
    bgClass: 'bg-gradient-to-br from-[#FF7A66] to-[#FF5A51]',
    link: '/listings?type=load',
  },
] as const;

export default function HomePage() {
  const t = useTranslations('home');
  const bannerType = useBannerType();
  const { data: banners } = useBanners({ type: bannerType });
  const { data: listings, isLoading } = useListings({
    page: 1,
    perPage: 24,
    sort: 'newest',
  });

  const topBanner = banners?.data?.find((b) => b.location === 'top');
  const middleBanner = banners?.data?.find(
    (b) => b.location === 'list' || b.location === 'inside',
  );
  const firstBlock = listings?.data?.slice(0, 8) ?? [];
  const secondBlock = listings?.data?.slice(8, 16) ?? [];
  const thirdBlock = listings?.data?.slice(16, 24) ?? [];

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
          <h2 className='text-[18px] sm:text-[20px] font-semibold text-gray-900 mb-2'>
            {t('viewByCategories')}
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4'>
            {/* Метки — видны только на md+, занимают первую строку сетки */}
            <div className='hidden md:flex col-span-3 items-center gap-1.5 text-[#6f7682] text-[14px] font-medium'>
              <Image
                src='/Vehicle Truck Profile.svg'
                alt=''
                width={20}
                height={20}
              />
              {t('cargoTransport')}
            </div>
            <div className='hidden md:flex col-span-2 items-center gap-1.5 text-[#6f7682] text-[14px] font-medium'>
              <Image
                src='/Vehicle Car Profile.svg'
                alt=''
                width={20}
                height={20}
              />
              {t('smallTransport')}
            </div>

            {/* Все 5 карточек — в ряд на md+, сетка на мобильном */}
            {CATEGORIES.map((cat) => {
              return (
                <Link
                  key={cat.key}
                  href={cat.link}
                  className={`relative ${cat.bgClass} rounded-[20px] sm:rounded-[30px] h-[120px] sm:h-[140px] p-4 sm:p-[15px] overflow-hidden hover:brightness-95 transition-all`}
                >
                  <span className='absolute z-10 left-4 top-4 sm:left-[15px] sm:top-[15px] text-[13px] sm:text-[16px] leading-[1.2] font-semibold text-white max-w-[66%] whitespace-nowrap'>
                    {t(cat.key)}
                  </span>

                  {cat.key === 'international' && (
                    <>
                      <div className='absolute left-3 bottom-2 sm:left-4 sm:bottom-3 w-[54%] h-[48%]'>
                        <Image
                          src={cat.image}
                          alt=''
                          fill
                          className='object-contain object-left-bottom'
                        />
                      </div>
                      <div className='absolute right-3 top-1/2 -translate-y-1/2 sm:right-[15px] w-[25%] h-[60%]'>
                        <Image
                          src={cat.secondaryImage}
                          alt=''
                          fill
                          className='object-contain object-center'
                        />
                      </div>
                    </>
                  )}

                  {cat.key === 'withinTurkmenistan' && (
                    <div className='absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 w-[78%] h-[65%]'>
                      <Image
                        src={cat.image}
                        alt=''
                        fill
                        className='object-contain object-center'
                      />
                    </div>
                  )}

                  {cat.key === 'withinCityRegion' && (
                    <div className='absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[84%] h-[72%]'>
                      <Image
                        src={cat.image}
                        alt=''
                        fill
                        className='object-contain object-center'
                      />
                    </div>
                  )}

                  {cat.key === 'hitchhiking' && (
                    <>
                      <div className='absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-[54%] h-[42%]'>
                        <Image
                          src={cat.image}
                          alt=''
                          fill
                          className='object-contain object-center'
                        />
                      </div>
                      <div className='absolute right-3 bottom-2 sm:right-[15px] sm:bottom-[15px] w-[24%] h-[26%]'>
                        <Image
                          src={cat.secondaryImage}
                          alt=''
                          fill
                          className='object-contain object-right-bottom'
                        />
                      </div>
                    </>
                  )}

                  {cat.key === 'parcels' && (
                    <>
                      <div className='absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[45%] h-[46%]'>
                        <Image
                          src={cat.image}
                          alt=''
                          fill
                          className='object-contain object-center'
                        />
                      </div>
                      <div className='absolute right-3 bottom-2 sm:right-[15px] sm:bottom-[15px] w-[28%] h-[24%]'>
                        <Image
                          src={cat.secondaryImage}
                          alt=''
                          fill
                          className='object-contain object-right-bottom'
                        />
                      </div>
                    </>
                  )}
                </Link>
              );
            })}
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
                  <ListingCard key={listing.id} listing={listing} from='home' />
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
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      from='home'
                    />
                  ))}
                </div>
              )}

              {thirdBlock.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px] mt-6'>
                  {thirdBlock.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      from='home'
                    />
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

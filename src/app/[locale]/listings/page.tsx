'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Drawer, FloatButton, Grid } from 'antd';
import { FilterOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { useInfiniteListings, useVehicleTypes, useBanners } from '@/lib/hooks';
import { useBannerType } from '@/lib/useBannerType';
import ListingCard from '@/components/ListingCard';
import ListingFilterContent from '@/components/ListingFilterContent';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from '@/i18n/navigation';
import Image from 'next/image';

const listPath = '/listings';

type FilterCategory = 'international' | 'intercity' | 'local' | 'traveler' | 'load' | '';

function categoryFromParams(
  locationType?: string,
  type?: string,
): FilterCategory {
  if (type === 'traveler') return 'traveler';
  if (type === 'load') return 'load';
  if (locationType === 'international') return 'international';
  if (locationType === 'intercity') return 'intercity';
  if (locationType === 'local') return 'local';
  return '';
}

function categoryToParams(category: FilterCategory): {
  locationType?: string;
  type?: string;
} {
  if (category === 'traveler') return { type: 'traveler' };
  if (category === 'load') return { type: 'load' };
  if (category === 'international' || category === 'intercity' || category === 'local')
    return { locationType: category };
  return {};
}

function buildListingsQuery(params: {
  type?: string;
  locationType?: string;
  from?: string;
  to?: string;
  kind?: string;
  sort?: string;
  travelerType?: string;
  loadType?: string;
}) {
  const search = new URLSearchParams();
  if (params.type) search.set('type', params.type);
  if (params.locationType) search.set('locationType', params.locationType);
  if (params.from) search.set('from', params.from);
  if (params.to) search.set('to', params.to);
  if (params.kind) search.set('kind', params.kind);
  if (params.sort && params.sort !== 'newest') search.set('sort', params.sort);
  if (params.travelerType) search.set('travelerType', params.travelerType);
  if (params.loadType) search.set('loadType', params.loadType);
  const q = search.toString();
  return q ? `${listPath}?${q}` : listPath;
}

export default function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = useTranslations('listing');
  const th = useTranslations('home');
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const resolvedSearchParams = use(searchParams);

  const type = (resolvedSearchParams.type as string) || undefined;
  const locationType =
    (resolvedSearchParams.locationType as string) || undefined;
  const from = (resolvedSearchParams.from as string) || undefined;
  const to = (resolvedSearchParams.to as string) || undefined;
  const kind = (resolvedSearchParams.kind as string) || undefined;
  const sort = (resolvedSearchParams.sort as string) || 'newest';
  const travelerType = (resolvedSearchParams.travelerType as string) || undefined;
  const loadType = (resolvedSearchParams.loadType as string) || undefined;

  const {
    data: infiniteData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteListings({
    type,
    locationType,
    fromLocationId: from,
    toLocationId: to,
    vehicleTypeId: kind,
    sort,
    travelerType,
    loadType,
  });

  const listings = infiniteData?.pages.flatMap((p) => p.data) ?? [];
  const totalCount = infiniteData?.pages[0]?.count ?? 0;

  const sentinelRef = useRef<HTMLDivElement>(null);
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: '200px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  const bannerType = useBannerType();
  const { data: vehicleTypes } = useVehicleTypes({ perPage: 100 });
  const { data: banners } = useBanners({ type: bannerType });

  const initialCategory = categoryFromParams(locationType, type);

  function deriveSub(
    cat: FilterCategory,
    urlType?: string,
    urlTravelerType?: string,
    urlLoadType?: string,
  ): { sub1: boolean; sub2: boolean } {
    if (cat === 'traveler') {
      return { sub1: urlTravelerType === 'person', sub2: urlTravelerType === 'vehicle' };
    }
    if (cat === 'load') {
      return { sub1: urlLoadType === 'load', sub2: urlLoadType === 'vehicle' };
    }
    return { sub1: urlType === 'cargo', sub2: urlType === 'vehicle' };
  }

  const initSub = deriveSub(initialCategory, type, travelerType, loadType);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>(initialCategory);
  const [filterFrom, setFilterFrom] = useState(from || '');
  const [filterTo, setFilterTo] = useState(to || '');
  const [filterKind, setFilterKind] = useState(kind || '');
  const [filterSort, setFilterSort] = useState(sort === 'newest' ? '' : sort);
  const [filterSender, setFilterSender] = useState(initSub.sub1);
  const [filterCarrier, setFilterCarrier] = useState(initSub.sub2);
  const [filterWeight, setFilterWeight] = useState('');
  const [filterVolume, setFilterVolume] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const cat = categoryFromParams(locationType, type);
    const sub = deriveSub(cat, type, travelerType, loadType);
    setFilterCategory(cat);
    setFilterFrom(from || '');
    setFilterTo(to || '');
    setFilterKind(kind || '');
    setFilterSort(sort === 'newest' ? '' : sort);
    setFilterSender(sub.sub1);
    setFilterCarrier(sub.sub2);
  }, [type, locationType, from, to, kind, sort, travelerType, loadType]);

  const clearFilters = () => {
    setFilterCategory('');
    setFilterFrom('');
    setFilterTo('');
    setFilterKind('');
    setFilterSort('');
    setFilterSender(false);
    setFilterCarrier(false);
    setFilterWeight('');
    setFilterVolume('');
    setFilterDate('');
    router.push(listPath);
    setIsFilterOpen(false);
  };

  const handleCategoryChange = (cat: FilterCategory) => {
    setFilterCategory(cat);
    setFilterSender(false);
    setFilterCarrier(false);
  };

  const applyFilters = () => {
    const catParams = categoryToParams(filterCategory);
    let effectiveType = catParams.type;
    let effectiveTravelerType: string | undefined;
    let effectiveLoadType: string | undefined;

    if (filterCategory === 'traveler') {
      if (filterSender && !filterCarrier) effectiveTravelerType = 'person';
      else if (filterCarrier && !filterSender) effectiveTravelerType = 'vehicle';
    } else if (filterCategory === 'load') {
      if (filterSender && !filterCarrier) effectiveLoadType = 'load';
      else if (filterCarrier && !filterSender) effectiveLoadType = 'vehicle';
    } else {
      if (filterSender && !filterCarrier) effectiveType = 'cargo';
      else if (filterCarrier && !filterSender) effectiveType = 'vehicle';
    }

    router.push(
      buildListingsQuery({
        type: effectiveType,
        locationType: catParams.locationType,
        from: filterFrom || undefined,
        to: filterTo || undefined,
        kind: filterKind || undefined,
        sort: filterSort || 'newest',
        travelerType: effectiveTravelerType,
        loadType: effectiveLoadType,
      }),
    );
    setIsFilterOpen(false);
  };

  const toggleSender = () => {
    setFilterSender((prev) => {
      const next = !prev;
      if (next) setFilterCarrier(false);
      return next;
    });
  };

  const toggleCarrier = () => {
    setFilterCarrier((prev) => {
      const next = !prev;
      if (next) setFilterSender(false);
      return next;
    });
  };

  const topBanner = banners?.data?.find((b) => b.location === 'top');
  const middleBanner = banners?.data?.find(
    (b) => b.location === 'list' || b.location === 'inside',
  );

  const filterProps = {
    category: filterCategory,
    onCategoryChange: handleCategoryChange,
    from: filterFrom,
    onFromChange: setFilterFrom,
    to: filterTo,
    onToChange: setFilterTo,
    weight: filterWeight,
    onWeightChange: setFilterWeight,
    volume: filterVolume,
    onVolumeChange: setFilterVolume,
    executionDate: filterDate,
    onExecutionDateChange: setFilterDate,
    kind: filterKind,
    onKindChange: setFilterKind,
    sort: filterSort,
    onSortChange: setFilterSort,
    senderSelected: filterSender,
    onSenderToggle: toggleSender,
    carrierSelected: filterCarrier,
    onCarrierToggle: toggleCarrier,
    vehicleTypes: vehicleTypes?.data,
    onClear: clearFilters,
    onApply: applyFilters,
  };

  return (
    <div className='min-h-screen pb-12'>
      <FloatButton.BackTop
        icon={<VerticalAlignTopOutlined style={{ color: '#fff' }} />}
        style={{ backgroundColor: '#2F5AA6' }}
        tooltip='Back to top'
      />
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6'>
        {/* Реклама 1 */}
        <section className='mb-6'>
          {topBanner ? (
            <a
              href={topBanner.link || '#'}
              target='_blank'
              rel='noreferrer'
              className='block w-full rounded-[20px] sm:rounded-2xl overflow-hidden bg-gray-100'
            >
              <Image
                src={`https://tm-cargo.com.tm/api/${topBanner.image}`}
                alt={th('adBanner')}
                width={1200}
                height={200}
                className='w-full h-[100px] sm:h-[140px] object-cover'
                crossOrigin='anonymous'
              />
            </a>
          ) : (
            <div className='w-full rounded-[20px] sm:rounded-2xl bg-[#e8e8e8] flex items-center justify-center h-[100px] sm:h-[140px] text-gray-400 text-base'>
              {th('adBanner')}
            </div>
          )}
        </section>

        <div className='flex flex-col lg:flex-row gap-[20px]'>
          {/* Sidebar - Фильтры */}
          <aside className='hidden lg:block w-[330px] shrink-0'>
            <div className='sticky top-0 max-h-screen overflow-y-auto py-1 scrollbar-thin'>
              <ListingFilterContent {...filterProps} />
            </div>
          </aside>

          <main className='flex-1 min-w-0'>
            <div className='flex items-center justify-between mb-3'>
              <h1 className='text-[18px] font-bold text-[#171717]'>
                {t('allListings')}
                {totalCount > 0 && (
                  <span className='ml-2 text-[14px] font-normal text-gray-400'>
                    ({totalCount})
                  </span>
                )}
              </h1>
            </div>

            {isMobile && (
              <Button
                className='w-full mb-3'
                icon={<FilterOutlined />}
                onClick={() => setIsFilterOpen(true)}
              >
                {t('filter')}
              </Button>
            )}

            {isLoading ? (
              <div className='flex justify-center py-20'>
                <LoadingSpinner />
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[10px]'>
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      from='listings'
                    />
                  ))}
                </div>

                {infiniteData &&
                  infiniteData.pages.length >= 1 &&
                  middleBanner && (
                    <section className='my-6'>
                      <a
                        href={middleBanner.link || '#'}
                        target='_blank'
                        rel='noreferrer'
                        className='block w-full rounded-[20px] sm:rounded-2xl overflow-hidden bg-gray-100'
                      >
                        <Image
                          src={`https://tm-cargo.com.tm/api/${middleBanner.image}`}
                          alt={th('adBanner2')}
                          width={900}
                          height={140}
                          className='w-full h-[100px] sm:h-[140px] object-cover'
                          crossOrigin='anonymous'
                        />
                      </a>
                    </section>
                  )}

                <div ref={sentinelRef} className='h-1' />

                {isFetchingNextPage && (
                  <div className='flex justify-center py-6'>
                    <LoadingSpinner />
                  </div>
                )}

                {!hasNextPage && listings.length > 0 && (
                  <p className='text-center text-gray-400 text-[13px] py-6'>
                    {listings.length} / {totalCount}
                  </p>
                )}
              </>
            ) : (
              <div className='bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm'>
                {t('noListings')}
              </div>
            )}
          </main>
        </div>

        {isMobile && (
          <Drawer
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            placement='left'
            size='min(100vw, 400px)'
            styles={{
              body: { padding: 0, background: '#EAF2FC', overflowY: 'auto' },
              header: { display: 'none' },
            }}
          >
            <ListingFilterContent
              {...filterProps}
              onClose={() => setIsFilterOpen(false)}
              className='min-h-full rounded-none'
            />
          </Drawer>
        )}
      </div>
    </div>
  );
}

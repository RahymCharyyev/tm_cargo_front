'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useListings, useVehicleTypes, useBanners } from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import ListingFilterContent from '@/components/ListingFilterContent';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from '@/i18n/navigation';
import Image from 'next/image';

const listPath = '/listings';

function buildListingsQuery(params: {
  page?: number;
  type?: string;
  locationType?: string;
  from?: string;
  to?: string;
  kind?: string;
  sort?: string;
}) {
  const search = new URLSearchParams();
  if (params.page && params.page > 1) search.set('page', String(params.page));
  if (params.type) search.set('type', params.type);
  if (params.locationType) search.set('locationType', params.locationType);
  if (params.from) search.set('from', params.from);
  if (params.to) search.set('to', params.to);
  if (params.kind) search.set('kind', params.kind);
  if (params.sort && params.sort !== 'newest') search.set('sort', params.sort);
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const resolvedSearchParams = use(searchParams);

  const page = Number(resolvedSearchParams.page) || 1;
  const type = (resolvedSearchParams.type as string) || undefined;
  const locationType =
    (resolvedSearchParams.locationType as string) || undefined;
  const from = (resolvedSearchParams.from as string) || undefined;
  const to = (resolvedSearchParams.to as string) || undefined;
  const kind = (resolvedSearchParams.kind as string) || undefined;
  const sort = (resolvedSearchParams.sort as string) || 'newest';

  const { data: listings, isLoading } = useListings({
    page,
    perPage: 12,
    type,
    locationType,
    fromLocationId: from,
    toLocationId: to,
    vehicleTypeId: kind,
    sort,
  });

  const { data: vehicleTypes } = useVehicleTypes({ perPage: 100 });
  const { data: banners } = useBanners();

  const [filterType, setFilterType] = useState(type || '');
  const [filterLocType, setFilterLocType] = useState(locationType || '');
  const [filterFrom, setFilterFrom] = useState(from || '');
  const [filterTo, setFilterTo] = useState(to || '');
  const [filterKind, setFilterKind] = useState(kind || '');
  const [filterSort, setFilterSort] = useState(sort === 'newest' ? '' : sort);
  const [filterSender, setFilterSender] = useState(type === 'cargo');
  const [filterCarrier, setFilterCarrier] = useState(type === 'vehicle');
  const [filterWeight, setFilterWeight] = useState('');
  const [filterVolume, setFilterVolume] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    setFilterType(type || '');
    setFilterLocType(locationType || '');
    setFilterFrom(from || '');
    setFilterTo(to || '');
    setFilterKind(kind || '');
    setFilterSort(sort === 'newest' ? '' : sort);
    setFilterSender(type === 'cargo');
    setFilterCarrier(type === 'vehicle');
  }, [type, locationType, from, to, kind, sort]);

  const clearFilters = () => {
    setFilterType('');
    setFilterLocType('');
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

  const effectiveType =
    filterSender && !filterCarrier
      ? 'cargo'
      : filterCarrier && !filterSender
        ? 'vehicle'
        : filterType || undefined;

  const applyFilters = () => {
    router.push(
      buildListingsQuery({
        page: 1,
        type: effectiveType,
        locationType: filterLocType || undefined,
        from: filterFrom || undefined,
        to: filterTo || undefined,
        kind: filterKind || undefined,
        sort: filterSort || 'newest',
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

  const totalPages = listings ? Math.ceil(listings.count / 12) : 0;

  const topBanner = banners?.data?.find((b) => b.location === 'top');
  const middleBanner = banners?.data?.find(
    (b) => b.location === 'list' || b.location === 'inside',
  );

  return (
    <div className='min-h-screen pb-12'>
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
            <div className='sticky top-20'>
              <ListingFilterContent
                locationType={filterLocType}
                onLocationTypeChange={setFilterLocType}
                from={filterFrom}
                onFromChange={setFilterFrom}
                to={filterTo}
                onToChange={setFilterTo}
                weight={filterWeight}
                onWeightChange={setFilterWeight}
                volume={filterVolume}
                onVolumeChange={setFilterVolume}
                executionDate={filterDate}
                onExecutionDateChange={setFilterDate}
                kind={filterKind}
                onKindChange={setFilterKind}
                sort={filterSort}
                onSortChange={setFilterSort}
                senderSelected={filterSender}
                onSenderToggle={toggleSender}
                carrierSelected={filterCarrier}
                onCarrierToggle={toggleCarrier}
                vehicleTypes={vehicleTypes?.data}
                onClear={clearFilters}
                onApply={applyFilters}
              />
            </div>
          </aside>

          <main className='flex-1 min-w-0'>
            <div className='flex items-center justify-between mb-3'>
              <h1 className='text-[18px] font-bold text-[#171717]'>
                {t('allListings')}
              </h1>
            </div>

            <button
              type='button'
              onClick={() => setIsFilterOpen(true)}
              className='lg:hidden w-full bg-white mb-3 py-2.5 rounded-lg text-[#171717] text-[13px] font-medium border border-gray-200 flex items-center justify-center gap-2'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                />
              </svg>
              {t('filter')}
            </button>

            {isLoading ? (
              <div className='flex justify-center py-20'>
                <LoadingSpinner />
              </div>
            ) : listings?.data && listings.data.length > 0 ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[10px]'>
                  {listings.data.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Реклама 2 */}
                <section className='my-6'>
                  {middleBanner ? (
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
                  ) : (
                    <div className='w-full rounded-[20px] sm:rounded-2xl bg-[#e8e8e8] flex items-center justify-center h-[100px] sm:h-[140px] text-gray-400 text-base'>
                      {th('adBanner2')}
                    </div>
                  )}
                </section>

                <div className='mt-8'>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) =>
                      router.push(
                        buildListingsQuery({
                          page: p,
                          type,
                          locationType,
                          from,
                          to,
                          kind,
                          sort,
                        }),
                      )
                    }
                  />
                </div>
              </>
            ) : (
              <div className='bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm'>
                {t('noListings')}
              </div>
            )}
          </main>
        </div>

        {/* Mobile filter drawer */}
        {isFilterOpen && (
          <div className='fixed inset-0 z-[60] lg:hidden'>
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setIsFilterOpen(false)}
            />
            <div className='absolute inset-y-0 left-0 w-full sm:max-w-[380px] overflow-y-auto p-3'>
              <ListingFilterContent
                locationType={filterLocType}
                onLocationTypeChange={setFilterLocType}
                from={filterFrom}
                onFromChange={setFilterFrom}
                to={filterTo}
                onToChange={setFilterTo}
                weight={filterWeight}
                onWeightChange={setFilterWeight}
                volume={filterVolume}
                onVolumeChange={setFilterVolume}
                executionDate={filterDate}
                onExecutionDateChange={setFilterDate}
                kind={filterKind}
                onKindChange={setFilterKind}
                sort={filterSort}
                onSortChange={setFilterSort}
                senderSelected={filterSender}
                onSenderToggle={toggleSender}
                carrierSelected={filterCarrier}
                onCarrierToggle={toggleCarrier}
                vehicleTypes={vehicleTypes?.data}
                onClear={clearFilters}
                onApply={applyFilters}
                className='min-h-full'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

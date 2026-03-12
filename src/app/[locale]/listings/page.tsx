'use client';

import { useState, use, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  useListings,
  useVehicleTypes,
  useLocations,
  useBanners,
} from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import LocationSelect from '@/components/LocationSelect';

const LOCATION_TYPES = ['international', 'intercity', 'local'] as const;
const TYPES = ['cargo', 'vehicle', 'traveler', 'load'] as const;

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

const inputClass =
  'w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9] outline-none transition-all';

export default function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const th = useTranslations('home');
  const locale = useLocale();
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

  const { data: locations } = useLocations({ perPage: 100 });
  const { data: vehicleTypes } = useVehicleTypes({ perPage: 100 });
  const { data: banners } = useBanners();

  const [filterType, setFilterType] = useState(type || '');
  const [filterLocType, setFilterLocType] = useState(locationType || '');
  const [filterFrom, setFilterFrom] = useState(from || '');
  const [filterTo, setFilterTo] = useState(to || '');
  const [filterKind, setFilterKind] = useState(kind || '');
  const [filterSender, setFilterSender] = useState(type === 'cargo');
  const [filterCarrier, setFilterCarrier] = useState(type === 'vehicle');

  useEffect(() => {
    setFilterType(type || '');
    setFilterLocType(locationType || '');
    setFilterFrom(from || '');
    setFilterTo(to || '');
    setFilterKind(kind || '');
    setFilterSender(type === 'cargo');
    setFilterCarrier(type === 'vehicle');
  }, [type, locationType, from, to, kind]);

  const clearFilters = () => {
    setFilterType('');
    setFilterLocType('');
    setFilterFrom('');
    setFilterTo('');
    setFilterKind('');
    setFilterSender(false);
    setFilterCarrier(false);
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
        sort,
      }),
    );
    setIsFilterOpen(false);
  };

  const handleSortChange = (newSort: string) => {
    router.push(
      buildListingsQuery({
        page: 1,
        type: effectiveType,
        locationType: filterLocType || undefined,
        from: filterFrom || undefined,
        to: filterTo || undefined,
        kind: filterKind || undefined,
        sort: newSort,
      }),
    );
  };

  const totalPages = listings ? Math.ceil(listings.count / 12) : 0;

  const getLocationName = (loc: {
    names: { en: string; ru: string; tk: string };
  }) =>
    (loc.names as Record<string, string>)[locale] ||
    loc.names.en ||
    loc.names.tk;

  const getTypeName = (vt: { names: { en: string; ru: string; tk: string } }) =>
    (vt.names as Record<string, string>)[locale] || vt.names.en || vt.names.tk;

  const topBanner = banners?.data?.find((b) => b.location === 'top');
  const middleBanner = banners?.data?.find(
    (b) => b.location === 'list' || b.location === 'inside',
  );

  const FilterContent = () => (
    <>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-[#171717] flex items-center gap-2'>
          <svg
            className='w-5 h-5 text-[#3D7EF9]'
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
        </h2>
        <button
          type='button'
          onClick={clearFilters}
          className='text-sm font-medium text-red-600 hover:text-red-700 hover:underline'
        >
          {t('clearFilters')}
        </button>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {t('category')}
          </label>
          <select
            value={filterLocType}
            onChange={(e) => setFilterLocType(e.target.value)}
            className={inputClass}
          >
            <option value=''>{tc('all')}</option>
            {LOCATION_TYPES.map((lt) => (
              <option key={lt} value={lt}>
                {t(lt)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className='block text-sm font-medium text-[#171717] mb-2'>
            {t('type')}
          </span>
          <div className='flex gap-4'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={filterSender}
                onChange={(e) => {
                  setFilterSender(e.target.checked);
                  if (e.target.checked) setFilterCarrier(false);
                }}
                className='w-4 h-4 rounded border-gray-300 text-[#3D7EF9] focus:ring-[#3D7EF9]'
              />
              <span className='text-sm text-[#171717]'>{t('sender')}</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={filterCarrier}
                onChange={(e) => {
                  setFilterCarrier(e.target.checked);
                  if (e.target.checked) setFilterSender(false);
                }}
                className='w-4 h-4 rounded border-gray-300 text-[#3D7EF9] focus:ring-[#3D7EF9]'
              />
              <span className='text-sm text-[#171717]'>{t('carrier')}</span>
            </label>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {tc('from')}
          </label>
          <LocationSelect
            value={filterFrom}
            onChange={setFilterFrom}
            placeholder={t('enterLocation')}
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {t('toLocation')}
          </label>
          <LocationSelect
            value={filterTo}
            onChange={setFilterTo}
            placeholder={t('enterLocation')}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {t('weightTons')}
          </label>
          <input
            type='number'
            placeholder={t('weightNotEntered')}
            className={inputClass}
            disabled
            aria-label={t('weightNotEntered')}
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {t('volumeM3')}
          </label>
          <input
            type='number'
            placeholder={t('volumeNotEntered')}
            className={inputClass}
            disabled
            aria-label={t('volumeNotEntered')}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {t('bodyType')}
          </label>
          <select
            value={filterKind}
            onChange={(e) => setFilterKind(e.target.value)}
            className={inputClass}
          >
            <option value=''>{tc('all')}</option>
            {vehicleTypes?.data?.map((vt) => (
              <option key={vt.id} value={vt.id}>
                {getTypeName(vt)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {t('executionDate')}
          </label>
          <select className={inputClass}>
            <option value=''>{t('selectDate')}</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-[#171717] mb-1.5'>
            {tc('sort')}
          </label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className={inputClass}
          >
            <option value='newest'>{t('newest')}</option>
            <option value='oldest'>{t('oldest')}</option>
            <option value='price_asc'>{t('priceLowHigh')}</option>
            <option value='price_desc'>{t('priceHighLow')}</option>
          </select>
        </div>

        <button
          type='button'
          onClick={applyFilters}
          className='w-full h-12 bg-[#3D7EF9] hover:bg-[#2B529B] text-white font-semibold rounded-xl shadow-sm transition-colors mt-1'
        >
          {t('apply')}
        </button>
      </div>
    </>
  );

  return (
    <div className='min-h-screen bg-[#d6e1ef] pb-12'>
      <div className='max-w-[1470px] mx-auto px-4 pt-6'>
        {/* Реклама 1 */}
        <section className='mb-6'>
          {topBanner ? (
            <a
              href={topBanner.link || '#'}
              target='_blank'
              rel='noreferrer'
              className='block w-full rounded-2xl overflow-hidden bg-white shadow-sm'
            >
              <Image
                src={`https://tm-cargo.com.tm/api/${topBanner.image}`}
                alt={th('adBanner')}
                width={1200}
                height={200}
                className='w-full h-32 sm:h-40 object-cover'
                crossOrigin='anonymous'
              />
            </a>
          ) : (
            <div className='w-full rounded-2xl bg-[#dedede] flex items-center justify-center h-24 sm:h-32 text-gray-500 text-xl'>
              {th('adBanner')}
            </div>
          )}
        </section>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar - Фильтры */}
          <aside className='hidden lg:block w-80 shrink-0'>
            <div className='rounded-2xl p-5 sticky top-24'>
              <FilterContent />
            </div>
          </aside>

          <main className='flex-1 min-w-0'>
            <div className='flex items-center justify-between mb-4'>
              <h1 className='text-2xl font-bold text-[#171717]'>
                {t('allListings')}
              </h1>
            </div>

            <button
              type='button'
              onClick={() => setIsFilterOpen(true)}
              className='lg:hidden w-full bg-[#2B5399] mb-4 py-3 rounded-xl text-[#171717] font-medium border border-white/50 flex items-center justify-center gap-2'
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
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                  {listings.data.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Реклама 2 */}
                {middleBanner && (
                  <section className='my-8'>
                    <a
                      href={middleBanner.link || '#'}
                      target='_blank'
                      rel='noreferrer'
                      className='block w-full rounded-2xl overflow-hidden bg-white shadow-sm'
                    >
                      <Image
                        src={`https://tm-cargo.com.tm/api/${middleBanner.image}`}
                        alt={th('adBanner2')}
                        width={900}
                        height={180}
                        className='w-full h-28 sm:h-36 object-cover'
                        crossOrigin='anonymous'
                      />
                    </a>
                  </section>
                )}
                {!middleBanner && (
                  <section className='my-8'>
                    <div className='w-full rounded-2xl bg-[#dedede] flex items-center justify-center h-24 text-gray-500 text-lg'>
                      {th('adBanner2')}
                    </div>
                  </section>
                )}

                <div className='mt-8'>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) =>
                      router.push(
                        buildListingsQuery({
                          page: p,
                          type: effectiveType,
                          locationType: filterLocType || undefined,
                          from: filterFrom || undefined,
                          to: filterTo || undefined,
                          kind: filterKind || undefined,
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
            <div className='absolute inset-y-0 left-0 w-full max-w-sm bg-[#2B5399] p-6 shadow-2xl overflow-y-auto'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-bold text-[#171717]'>
                  {t('filter')}
                </h2>
                <button
                  type='button'
                  onClick={() => setIsFilterOpen(false)}
                  className='p-2 text-gray-600 hover:text-gray-900'
                >
                  ✕
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

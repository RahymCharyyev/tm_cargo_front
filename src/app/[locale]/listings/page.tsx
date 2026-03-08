'use client';

import { useState, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useListings, useVehicleTypes, useLocations, useBanners } from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from '@/i18n/navigation';
import Image from 'next/image';

const LOCATION_TYPES = ['international', 'intercity', 'local'] as const;
const TYPES = ['cargo', 'vehicle', 'traveler', 'load'] as const;

const listPath = '/listings';

function buildListingsQuery(params: { page?: number; type?: string; locationType?: string; from?: string; kind?: string; sort?: string }) {
  const search = new URLSearchParams();
  if (params.page && params.page > 1) search.set('page', String(params.page));
  if (params.type) search.set('type', params.type);
  if (params.locationType) search.set('locationType', params.locationType);
  if (params.from) search.set('from', params.from);
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
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const resolvedSearchParams = use(searchParams);

  const page = Number(resolvedSearchParams.page) || 1;
  const type = (resolvedSearchParams.type as string) || undefined;
  const locationType = (resolvedSearchParams.locationType as string) || undefined;
  const from = (resolvedSearchParams.from as string) || undefined;
  const kind = (resolvedSearchParams.kind as string) || undefined;
  const sort = (resolvedSearchParams.sort as string) || 'newest';

  const { data: listings, isLoading } = useListings({
    page,
    perPage: 12,
    type,
    locationType,
    fromLocationId: from,
    vehicleTypeId: kind,
    sort,
  });

  const { data: locations } = useLocations({ perPage: 100 });
  const { data: vehicleTypes } = useVehicleTypes({ perPage: 100 });
  const { data: banners } = useBanners();

  const [filterType, setFilterType] = useState(type || '');
  const [filterLocType, setFilterLocType] = useState(locationType || '');
  const [filterFrom, setFilterFrom] = useState(from || '');
  const [filterKind, setFilterKind] = useState(kind || '');

  const applyFilters = () => {
    router.push(buildListingsQuery({ page: 1, type: filterType || undefined, locationType: filterLocType || undefined, from: filterFrom || undefined, kind: filterKind || undefined, sort }));
    setIsFilterOpen(false);
  };

  const handleSortChange = (newSort: string) => {
    router.push(buildListingsQuery({ page: 1, type: filterType || undefined, locationType: filterLocType || undefined, from: filterFrom || undefined, kind: filterKind || undefined, sort: newSort }));
  };

  const totalPages = listings ? Math.ceil(listings.count / 12) : 0;

  const getLocationName = (loc: { names: { en: string; ru: string; tk: string } }) =>
    (loc.names as Record<string, string>)[locale] || loc.names.en || loc.names.tk;

  const getTypeName = (vt: { names: { en: string; ru: string; tk: string } }) =>
    (vt.names as Record<string, string>)[locale] || vt.names.en || vt.names.tk;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-12">
      <div className="max-w-[1470px] mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{t('listings')}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{tc('home')}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{t('listings')}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-72 shrink-0 space-y-4">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 sticky top-24">
              <div className="space-y-4">
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">{t('allTypes')}</option>
                    {TYPES.map((tVal) => (
                      <option key={tVal} value={tVal}>{t(tVal)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={filterLocType}
                    onChange={(e) => setFilterLocType(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">{t('allLocationTypes')}</option>
                    {LOCATION_TYPES.map((lt) => (
                      <option key={lt} value={lt}>{t(lt)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={filterFrom}
                    onChange={(e) => setFilterFrom(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">{t('fromLocation')}</option>
                    {locations?.data?.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {getLocationName(loc)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={filterKind}
                    onChange={(e) => setFilterKind(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">{t('vehicleType')}</option>
                    {vehicleTypes?.data?.map((vt) => (
                      <option key={vt.id} value={vt.id}>
                        {getTypeName(vt)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={applyFilters}
                  className="w-full h-12 bg-[#3D7EF9] hover:bg-[#2B529B] text-white font-medium rounded-lg shadow-sm transition-colors mt-2"
                >
                  {tc('search')}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {banners?.data?.filter(b => b.location === 'sidebar').map((banner) => (
                <a key={banner.id} href={banner.link || '#'} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={`https://tm-cargo.com.tm/api/${banner.image}`}
                    alt="Ad"
                    width={300}
                    height={400}
                    className="w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </a>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-gray-100">
              <div className="text-gray-600 font-medium">
                {isLoading ? '...' : `${t('foundResults')} ${listings?.count || 0}`}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm hidden sm:inline">{t('sortBy')}:</span>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-gray-50 border-none text-sm font-medium text-gray-700 py-2 pl-3 pr-8 rounded-md focus:ring-0 cursor-pointer hover:bg-gray-100"
                >
                  <option value="newest">{t('newest')}</option>
                  <option value="oldest">{t('oldest')}</option>
                  <option value="price_asc">{t('priceLowHigh')}</option>
                  <option value="price_desc">{t('priceHighLow')}</option>
                </select>
              </div>
            </div>

            {banners?.data?.find(b => b.location === 'top') && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={`https://tm-cargo.com.tm/api/${banners.data.find(b => b.location === 'top')?.image}`}
                  alt="Banner"
                  width={900}
                  height={200}
                  className="w-full max-h-48 object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            )}

            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden w-full bg-white mb-4 py-3 rounded-lg text-blue-600 font-medium border border-blue-100 shadow-sm"
            >
              {t('filter')}
            </button>

            {isLoading ? (
              <div className="flex justify-center py-20"><LoadingSpinner /></div>
            ) : listings?.data && listings.data.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {listings.data.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => router.push(buildListingsQuery({ page: p, type: filterType || undefined, locationType: filterLocType || undefined, from: filterFrom || undefined, kind: filterKind || undefined, sort }))}
                  />
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm">
                {t('noListings')}
              </div>
            )}
          </main>
        </div>

        {isFilterOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 bg-white p-6 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{t('filter')}</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-500">✕</button>
              </div>
              <div className="space-y-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <option value="">{t('allTypes')}</option>
                  {TYPES.map((tVal) => <option key={tVal} value={tVal}>{t(tVal)}</option>)}
                </select>
                <select
                  value={filterLocType}
                  onChange={(e) => setFilterLocType(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <option value="">{t('allLocationTypes')}</option>
                  {LOCATION_TYPES.map((lt) => <option key={lt} value={lt}>{t(lt)}</option>)}
                </select>
                <select
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <option value="">{t('fromLocation')}</option>
                  {locations?.data?.map((loc) => (
                    <option key={loc.id} value={loc.id}>{getLocationName(loc)}</option>
                  ))}
                </select>
                <select
                  value={filterKind}
                  onChange={(e) => setFilterKind(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <option value="">{t('vehicleType')}</option>
                  {vehicleTypes?.data?.map((vt) => (
                    <option key={vt.id} value={vt.id}>{getTypeName(vt)}</option>
                  ))}
                </select>
                <button onClick={applyFilters} className="w-full h-12 bg-[#3b66f5] text-white font-medium rounded-lg mt-4">
                  {tc('search')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

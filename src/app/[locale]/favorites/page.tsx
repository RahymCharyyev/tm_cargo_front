'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFavorites, useRemoveFavorite } from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import { Link } from '@/i18n/navigation';

export default function FavoritesPage() {
  const t = useTranslations('favorites');
  const tl = useTranslations('listing');
  const tc = useTranslations('common');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFavorites({ page, perPage: 12 });

  const totalPages = data ? Math.ceil(data.count / 12) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('empty')}</h2>
          <p className="text-gray-500 mb-6">{t('emptyDesc')}</p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            {tl('allListings')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.data?.map((fav) =>
              fav.listing ? (
                <ListingCard key={fav.listingId} listing={{ ...fav.listing, isFavorite: true }} />
              ) : null,
            )}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

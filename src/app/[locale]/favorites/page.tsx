'use client';

import { Button, Empty } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFavorites } from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import { Link } from '@/i18n/navigation';

export default function FavoritesPage() {
  const t = useTranslations('favorites');
  const tl = useTranslations('listing');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFavorites({ page, perPage: 12 });

  const totalPages = data ? Math.ceil(data.count / 12) : 0;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
        {t('title')}
      </h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : data?.data?.length === 0 ? (
        <div className='text-center py-16 bg-white rounded-2xl border border-gray-100'>
          <Empty
            styles={{
              image: { fontSize: 64 },
            }}
            description={
              <div className='space-y-2'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  {t('empty')}
                </h2>
                <p className='text-gray-500'>{t('emptyDesc')}</p>
              </div>
            }
          >
            <Link href='/'>
              <Button
                type='primary'
                size='large'
                style={{
                  background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
                  border: 'none',
                  borderRadius: 12,
                }}
              >
                {tl('allListings')}
              </Button>
            </Link>
          </Empty>
        </div>
      ) : (
        <>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {data?.data?.map((fav) =>
              fav.listing ? (
                <ListingCard
                  key={fav.listingId}
                  listing={{ ...fav.listing, isFavorite: true }}
                />
              ) : null,
            )}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

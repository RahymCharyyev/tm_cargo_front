'use client';

import { Button, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { useListings, useDeleteAccount } from '@/lib/hooks';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tl = useTranslations('listing');
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const deleteAccount = useDeleteAccount();

  const [page, setPage] = useState(1);
  const { data: myListings, isLoading } = useListings({
    my: 'true',
    page,
    perPage: 6,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-16 text-center'>
        <LoadingSpinner />
      </div>
    );
  }

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: t('deleteAccountConfirm'),
      okText: 'OK',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () =>
        deleteAccount.mutate(undefined, {
          onSuccess: () => router.push('/'),
        }),
    });
  };

  const totalPages = myListings ? Math.ceil(myListings.count / 6) : 0;

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Profile Card */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8'>
        <div className='bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] p-8 text-center'>
          <div className='w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mb-3'>
            {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h1 className='text-2xl font-bold text-white'>
            {user.fullName || '—'}
          </h1>
          <p className='text-white/70 text-sm mt-1'>
            {t('role')}: {t(user.role)}
          </p>
        </div>

        <div className='p-6 space-y-3'>
          {user.email && (
            <div className='flex items-center gap-3 text-sm'>
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <span className='text-gray-700'>{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className='flex items-center gap-3 text-sm'>
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              </svg>
              <span className='text-gray-700'>{user.phone}</span>
            </div>
          )}

          <div className='pt-4 border-t border-gray-100'>
            <Button danger onClick={handleDeleteAccount}>
              {t('deleteAccount')}
            </Button>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <div>
        <h2 className='text-xl font-bold text-gray-900 mb-6'>
          {tl('myListings')}
        </h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : myListings?.data?.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-2xl border border-gray-100'>
            <div className='text-4xl mb-3'>📦</div>
            <p className='text-gray-500'>{tl('noListings')}</p>
          </div>
        ) : (
          <>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {myListings?.data?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

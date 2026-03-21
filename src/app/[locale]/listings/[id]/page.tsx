'use client';

import { use, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  useListing,
  useDeleteListing,
  useAddFavorite,
  useRemoveFavorite,
  useBanners,
} from '@/lib/hooks';
import { useBannerType } from '@/lib/useBannerType';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from '@/i18n/navigation';
import { Button, Modal as AntModal } from 'antd';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const currencySymbols: Record<string, string> = {
  manat: 'TMT',
  dollar: '$',
  euro: '€',
};

function getName(
  names: { en: string; ru: string; tk: string } | undefined | null,
  locale: string,
): string {
  if (!names) return '—';
  return (
    (names as unknown as Record<string, string>)[locale] ||
    names.en ||
    names.tk ||
    '—'
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='flex items-start gap-2'>
      <span className='text-[#595959] text-sm whitespace-nowrap'>{label}</span>
      <span className='text-black text-sm font-medium'>{value}</span>
    </div>
  );
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');
  const bannerType = useBannerType();
  const { data: listing, isLoading } = useListing(id);
  const { data: banners } = useBanners({ type: bannerType });
  const deleteMutation = useDeleteListing();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const [activeImg, setActiveImg] = useState(0);

  const topBanner = banners?.data?.find((b) => b.location === 'top');

  if (isLoading) return <LoadingSpinner />;
  if (!listing) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-16 text-center'>
        <div className='text-6xl mb-4'>🔍</div>
        <h2 className='text-xl font-semibold text-gray-900'>
          {tc('noResults')}
        </h2>
      </div>
    );
  }

  const isOwner = user?.id === listing.userId;
  const fromName = listing.from ? getName(listing.from.names, locale) : '—';
  const toName = listing.to ? getName(listing.to.names, locale) : '—';
  const fromParent = listing.from?.parentNames
    ? getName(listing.from.parentNames, locale)
    : null;
  const toParent = listing.to?.parentNames
    ? getName(listing.to.parentNames, locale)
    : null;
  const fromCountry = listing.from?.countryNames
    ? getName(listing.from.countryNames, locale)
    : null;
  const toCountry = listing.to?.countryNames
    ? getName(listing.to.countryNames, locale)
    : null;
  function getFlagUrl(icon: string | null | undefined): string | null {
    if (!icon) return null;
    if (icon.startsWith('http')) return icon;
    return `https://tm-cargo.com.tm/api/${icon}`;
  }

  const fromFlagUrl =
    getFlagUrl(listing.from?.icon) ?? getFlagUrl(listing.from?.parentIcon);
  const toFlagUrl =
    getFlagUrl(listing.to?.icon) ?? getFlagUrl(listing.to?.parentIcon);

  const phone = listing.phone || listing.owner?.phone;
  const email = listing.email || listing.owner?.email;

  const locationTypeLabel =
    listing.locationType === 'international'
      ? t('international')
      : listing.locationType === 'intercity'
        ? t('intercity')
        : t('local');

  const typeLabel =
    listing.type === 'cargo'
      ? t('cargo')
      : listing.type === 'vehicle'
        ? t('vehicle')
        : listing.type === 'traveler'
          ? t('traveler')
          : t('load');

  const handleDelete = () => {
    AntModal.confirm({
      title: t('deleteConfirm'),
      okText: 'OK',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () =>
        deleteMutation.mutate(id, {
          onSuccess: () => router.push('/'),
        }),
    });
  };

  const handleFavorite = () => {
    if (!isAuthenticated) return;
    if (listing.isFavorite) {
      removeFav.mutate(listing.id);
    } else {
      addFav.mutate(listing.id);
    }
  };

  const images = listing.images ?? [];

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#E8F2FF' }}>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[35px] py-6'>
        {/* Ad banner */}
        <section className='mb-5'>
          {topBanner ? (
            <a
              href={topBanner.link || '#'}
              target='_blank'
              rel='noreferrer'
              className='block w-full rounded-[20px] sm:rounded-[30px] overflow-hidden bg-gray-100'
            >
              <Image
                src={`https://tm-cargo.com.tm/api/${topBanner.image}`}
                alt='Реклама'
                width={1200}
                height={280}
                className='w-full h-[100px] sm:h-[140px] object-cover'
                crossOrigin='anonymous'
              />
            </a>
          ) : (
            <div className='w-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-b from-white to-[#FAFAFA] flex items-center justify-center h-[100px] sm:h-[140px] text-[#999] text-base'>
              Реклама 1
            </div>
          )}
        </section>

        {/* Breadcrumb */}
        <nav className='flex items-center gap-1.5 text-sm mb-4 flex-wrap'>
          {refParam === 'home' ? (
            <>
              <Link
                href='/'
                className='flex items-center gap-1 text-black/45 hover:text-black/70 transition-colors'
              >
                <svg
                  className='w-3.5 h-3.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
                </svg>
                {tc('home')}
              </Link>
              <span className='text-black/30'>/</span>
            </>
          ) : refParam === 'listings' ? (
            <>
              <Link
                href='/listings'
                className='text-black/45 hover:text-black/70 transition-colors'
              >
                {t('allListings')}
              </Link>
              <span className='text-black/30'>/</span>
            </>
          ) : (
            <>
              <Link
                href='/'
                className='flex items-center gap-1 text-black/45 hover:text-black/70 transition-colors'
              >
                <svg
                  className='w-3.5 h-3.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
                </svg>
                {tc('home')}
              </Link>
              <span className='text-black/30'>/</span>
            </>
          )}
          <span className='text-black/88 font-medium truncate max-w-xs'>
            {listing.title}
          </span>
        </nav>

        {/* Two-column layout */}
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* ===== LEFT COLUMN ===== */}
          <div className='flex flex-col gap-6 lg:flex-[823_1_0%]'>
            <h1 className='text-2xl font-bold text-black'>{listing.title}</h1>
            {/* Image card */}
            <div
              className='bg-white rounded-[30px] overflow-hidden'
              style={{ minHeight: '400px' }}
            >
              {images.length > 0 ? (
                <div>
                  <div className='relative' style={{ height: '420px' }}>
                    <Image
                      src={`https://tm-cargo.com.tm/api/${images[activeImg]?.filename}`}
                      alt={listing.title}
                      fill
                      crossOrigin='anonymous'
                      className='object-cover'
                    />
                  </div>
                  {images.length > 1 && (
                    <div className='flex gap-3 p-4 overflow-x-auto'>
                      {images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImg(idx)}
                          className={`shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                            idx === activeImg
                              ? 'border-[#2B529B]'
                              : 'border-transparent'
                          }`}
                        >
                          <Image
                            src={`https://tm-cargo.com.tm/api/${img.filename}`}
                            alt={listing.title}
                            width={96}
                            height={64}
                            crossOrigin='anonymous'
                            className='object-cover w-24 h-16'
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex items-center justify-center h-[420px] bg-gray-50'>
                  <svg
                    className='w-28 h-28 text-gray-200'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1'
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Description card */}
            {listing.description && (
              <div className='bg-white rounded-[30px] px-6 py-6'>
                <p
                  className='text-sm font-medium mb-4'
                  style={{ color: '#595959' }}
                >
                  {tc('description')}
                </p>
                <p className='text-black leading-relaxed whitespace-pre-wrap text-sm'>
                  {listing.description}
                </p>
              </div>
            )}

            {/* Owner actions */}
            {isOwner && (
              <div className='flex gap-3'>
                <Link href={`/listings/${id}/edit`} className='flex-1'>
                  <Button
                    type='primary'
                    block
                    size='large'
                    style={{
                      backgroundColor: '#2B529B',
                      borderColor: '#2B529B',
                      borderRadius: 20,
                      height: 52,
                      fontWeight: 600,
                    }}
                  >
                    {tc('edit')}
                  </Button>
                </Link>
                <Button
                  danger
                  size='large'
                  onClick={handleDelete}
                  loading={deleteMutation.isPending}
                  style={{ borderRadius: 20, height: 52, fontWeight: 600 }}
                >
                  {tc('delete')}
                </Button>
              </div>
            )}
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className='flex flex-col gap-6 lg:flex-[554_1_0%]'>
            {/* Section heading */}
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-black'>
                {t('detailInfo')}
              </h2>
              {isAuthenticated && (
                <Button
                  type='text'
                  shape='circle'
                  onClick={handleFavorite}
                  title={listing.isFavorite ? t('removeFavorite') : t('addFavorite')}
                  icon={
                    <svg
                      className='w-6 h-6'
                      fill={listing.isFavorite ? 'currentColor' : 'none'}
                      stroke='currentColor'
                      style={{ color: listing.isFavorite ? '#ef4444' : '#9ca3af' }}
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                    </svg>
                  }
                />
              )}
            </div>

            {/* Info panel card */}
            <div className='bg-white rounded-[30px] px-6 py-7 flex flex-col gap-5'>
              {/* Route: From → To */}
              <div className='flex flex-col gap-4'>
                {/* FROM */}
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 shrink-0 flex items-center justify-center'>
                    <Image
                      src={'/Location.svg'}
                      alt={fromName}
                      width={15}
                      height={15}
                    />
                  </div>
                  <span
                    className='text-sm font-medium'
                    style={{ color: '#595959', minWidth: '52px' }}
                  >
                    {tc('from')}
                  </span>
                  <span
                    className='w-4 border-t'
                    style={{ borderColor: '#595959' }}
                  />
                  <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <span className='text-sm font-semibold text-black truncate'>
                      {fromName}
                      {fromParent ? `, ${fromParent}` : ''}
                      {fromCountry ? `, ${fromCountry}` : ''}
                    </span>
                    {fromFlagUrl && (
                      <Image
                        src={fromFlagUrl}
                        alt=''
                        width={24}
                        height={16}
                        crossOrigin='anonymous'
                        className='rounded-sm shrink-0 object-cover'
                        style={{ width: 24, height: 16 }}
                      />
                    )}
                  </div>
                </div>

                {/* TO */}
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 shrink-0 flex items-center justify-center'>
                    <Image
                      src={'/Location Target Square.svg'}
                      alt={toName}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span
                    className='text-sm font-medium'
                    style={{ color: '#595959', minWidth: '52px' }}
                  >
                    {tc('to')}
                  </span>
                  <span
                    className='w-4 border-t'
                    style={{ borderColor: '#595959' }}
                  />
                  <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <span className='text-sm font-semibold text-black truncate'>
                      {toName}
                      {toParent ? `, ${toParent}` : ''}
                      {toCountry ? `, ${toCountry}` : ''}
                    </span>
                    {toFlagUrl && (
                      <Image
                        src={toFlagUrl}
                        alt=''
                        width={24}
                        height={16}
                        crossOrigin='anonymous'
                        className='rounded-sm shrink-0 object-cover'
                        style={{ width: 24, height: 16 }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr style={{ borderColor: '#D9D9D9' }} />

              {/* Cargo / Vehicle / Traveler / Load specifics */}
              <div className='flex flex-col gap-3'>
                {listing.cargo && (
                  <>
                    {listing.cargo.weight_kg != null && (
                      <InfoRow
                        label={`${t('weight')}:`}
                        value={
                          listing.cargo.weight_kg >= 1000
                            ? `${(listing.cargo.weight_kg / 1000).toFixed(listing.cargo.weight_kg % 1000 === 0 ? 0 : 1)} т`
                            : `${listing.cargo.weight_kg} кг`
                        }
                      />
                    )}
                    {listing.cargo.volume_m3 != null && (
                      <InfoRow
                        label={`${t('volume')}:`}
                        value={`${listing.cargo.volume_m3} м³`}
                      />
                    )}
                    {listing.cargo.vehicleType && (
                      <InfoRow
                        label={`${t('vehicleType')}:`}
                        value={getName(listing.cargo.vehicleType.names, locale)}
                      />
                    )}
                  </>
                )}
                {listing.vehicle && (
                  <>
                    {listing.vehicle.weight_kg != null && (
                      <InfoRow
                        label={`${t('weight')}:`}
                        value={
                          listing.vehicle.weight_kg >= 1000
                            ? `${(listing.vehicle.weight_kg / 1000).toFixed(listing.vehicle.weight_kg % 1000 === 0 ? 0 : 1)} т`
                            : `${listing.vehicle.weight_kg} кг`
                        }
                      />
                    )}
                    {listing.vehicle.volume_m3 != null && (
                      <InfoRow
                        label={`${t('volume')}:`}
                        value={`${listing.vehicle.volume_m3} м³`}
                      />
                    )}
                    {listing.vehicle.vehicleType && (
                      <InfoRow
                        label={`${t('vehicleType')}:`}
                        value={getName(
                          listing.vehicle.vehicleType.names,
                          locale,
                        )}
                      />
                    )}
                  </>
                )}
                {listing.traveler && (
                  <>
                    <InfoRow
                      label={`${t('travelerType')}:`}
                      value={
                        listing.traveler.travelerType === 'person'
                          ? t('person')
                          : t('vehicle')
                      }
                    />
                    <InfoRow
                      label={`${t('bodyCount')}:`}
                      value={String(listing.traveler.bodyCount)}
                    />
                  </>
                )}
                {listing.load && (
                  <>
                    <InfoRow
                      label={`${t('loadType')}:`}
                      value={
                        listing.load.loadType === 'vehicle'
                          ? t('vehicle')
                          : t('load')
                      }
                    />
                    {listing.load.weight_kg != null && (
                      <InfoRow
                        label={`${t('weight')}:`}
                        value={
                          listing.load.weight_kg >= 1000
                            ? `${(listing.load.weight_kg / 1000).toFixed(listing.load.weight_kg % 1000 === 0 ? 0 : 1)} т`
                            : `${listing.load.weight_kg} кг`
                        }
                      />
                    )}
                  </>
                )}
                {listing.dueDate && (
                  <InfoRow
                    label={`${t('dueDate')}:`}
                    value={new Date(listing.dueDate).toLocaleDateString()}
                  />
                )}
                {listing.price != null && (
                  <InfoRow
                    label={`${tc('price')}:`}
                    value={
                      <span className='text-black font-bold text-base'>
                        {listing.price.toLocaleString()}{' '}
                        {listing.currency
                          ? currencySymbols[listing.currency]
                          : ''}
                      </span>
                    }
                  />
                )}
              </div>

              {/* Divider */}
              <hr style={{ borderColor: '#D9D9D9' }} />

              {/* Meta info */}
              <div className='flex flex-col gap-3'>
                <InfoRow
                  label={`${t('category')}:`}
                  value={`${locationTypeLabel} / ${typeLabel}`}
                />
                <InfoRow
                  label={`${t('createdAt')}:`}
                  value={new Date(listing.createdAt).toLocaleDateString()}
                />
                <InfoRow
                  label={`${tc('views')}:`}
                  value={
                    <span className='flex items-center gap-1'>
                      <svg
                        className='w-4 h-4 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                      {listing.viewCount}
                    </span>
                  }
                />
                {listing.owner?.fullName && (
                  <InfoRow
                    label={`${t('ownerInfo')}:`}
                    value={listing.owner.fullName}
                  />
                )}
                {phone && <InfoRow label={`${tc('phone')}:`} value={phone} />}
                {email && <InfoRow label={`${tc('email')}:`} value={email} />}
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex flex-col gap-3'>
              {phone && (
                <a href={`tel:${phone}`}>
                  <Button
                    block
                    size='large'
                    icon={
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' />
                      </svg>
                    }
                    style={{
                      backgroundColor: '#3D991A',
                      borderColor: '#3D991A',
                      color: 'white',
                      borderRadius: 20,
                      height: 54,
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    {t('callNow')}
                  </Button>
                </a>
              )}

              {email && (
                <a href={`mailto:${email}`}>
                  <Button
                    block
                    size='large'
                    icon={
                      <svg className='w-5 h-5 text-[#2B529B]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                      </svg>
                    }
                    style={{ borderRadius: 20, height: 54, fontWeight: 600, fontSize: 16 }}
                  >
                    {t('writeEmail')}
                  </Button>
                </a>
              )}

              {isAuthenticated && (
                <Button
                  block
                  size='large'
                  onClick={handleFavorite}
                  icon={
                    <svg
                      className='w-5 h-5 text-[#2B529B]'
                      fill={listing.isFavorite ? 'currentColor' : 'none'}
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                        d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' />
                    </svg>
                  }
                  style={{ borderRadius: 20, height: 54, fontWeight: 600, fontSize: 16 }}
                >
                  {listing.isFavorite ? t('removeFavorite') : t('addFavorite')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

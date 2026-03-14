'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Listing } from '@/lib/hooks';

interface Props {
  listing: Listing;
}

const currencySymbols: Record<string, string> = {
  manat: 'TMT',
  dollar: '$',
  euro: '€',
};

function getLocationName(
  loc: { names: { en: string; ru: string; tk: string } } | null | undefined,
  locale: string,
): string {
  if (!loc) return '—';
  return (
    (loc.names as unknown as Record<string, string>)[locale] ||
    loc.names.en ||
    loc.names.tk
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '.');
}

function getFlagUrl(
  loc:
    | {
        icon?: string | null;
        parentIcon?: string | null;
      }
    | null
    | undefined,
): string | null {
  const icon = loc?.icon || loc?.parentIcon;
  if (!icon) return null;
  if (icon.startsWith('http')) return icon;
  return `https://tm-cargo.com.tm/api/${icon}`;
}

export default function ListingCard({ listing }: Props) {
  const t = useTranslations('listing');
  const locale = useLocale();

  const mainImage = listing.images?.[0]?.filename
    ? `https://tm-cargo.com.tm/api/${listing.images[0].filename}`
    : null;

  const fromName = getLocationName(listing.from, locale);
  const toName = getLocationName(listing.to, locale);
  const fromFlag = getFlagUrl(listing.from);
  const toFlag = getFlagUrl(listing.to);
  const dateDisplay = formatDate(listing.createdAt);
  const today = new Date();
  const created = new Date(listing.createdAt);
  const isToday = created.toDateString() === today.toDateString();

  const categoryName = t(listing.locationType);
  const senderName = listing.owner?.fullName || '—';
  const weightKg =
    listing.cargo?.weight_kg ??
    listing.vehicle?.weight_kg ??
    listing.load?.weight_kg;
  const volumeM3 = listing.cargo?.volume_m3 ?? listing.vehicle?.volume_m3;
  const weightStr =
    weightKg != null
      ? `${weightKg >= 1000 ? (weightKg / 1000).toFixed(0) : weightKg}${weightKg >= 1000 ? 'т' : ' кг'}`
      : '—';
  const volumeStr = volumeM3 != null ? `${volumeM3}м³` : '—';

  const currencyLabel = listing.currency
    ? currencySymbols[listing.currency]
    : 'TMT';
  const priceStr =
    listing.price != null
      ? `${listing.price.toLocaleString()} ${currencyLabel}`
      : '—';

  return (
    <Link
      href={`/listings/${listing.id}`}
      className='block group h-full w-[342px]'
    >
      <div className='bg-white rounded-[30px] overflow-hidden hover:shadow-md hover:shadow-gray-200 transition-all duration-200 h-full flex flex-col'>
        {/* Photo — 250px */}
        <div className='relative h-[250px] w-full bg-gray-100 overflow-hidden'>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              crossOrigin='anonymous'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-300 text-sm'>
              No image
            </div>
          )}
        </div>

        <div className='px-4 pt-3 pb-4 flex flex-col flex-1 text-[15px] leading-[1.6]'>
          <h3 className='text-[18px] font-bold text-black line-clamp-2 mb-2'>
            {listing.title}
          </h3>

          {/* Route with flags */}
          <div className='flex items-center gap-1.5 mb-2 text-black'>
            <Image
              src={'/Location.svg'}
              alt=''
              width={14}
              height={20}
              className='w-[14px] h-[20px] object-cover shrink-0'
              crossOrigin='anonymous'
            />
            {fromFlag ? (
              <Image
                src={fromFlag}
                alt=''
                width={24}
                height={16}
                className='w-6 h-4 object-cover rounded-[2px] shrink-0'
                crossOrigin='anonymous'
              />
            ) : (
              <span className='w-2 h-2 rounded-full bg-red-500 shrink-0' />
            )}
            <span className='truncate'>{fromName}</span>
            <span className='text-[#B3B3B3] mx-0.5'>—</span>
            {toFlag ? (
              <Image
                src={toFlag}
                alt=''
                width={24}
                height={16}
                className='w-6 h-4 object-cover rounded-[2px] shrink-0'
                crossOrigin='anonymous'
              />
            ) : (
              <span className='w-2 h-2 rounded-full bg-blue-500 shrink-0' />
            )}
            <span className='truncate'>{toName}</span>
          </div>

          {/* Категория: название и тип */}
          <div className='mb-2'>
            <span className='text-[#4D4D4D]'>{t('categoryLabel')}:</span>
            <span className='text-black ml-1 font-medium'>{categoryName}</span>
          </div>

          {/* Вес | Объём | Дата — названия и значения */}
          <div className='flex items-center flex-wrap gap-x-1.5 mb-3'>
            <span className='text-[#4D4D4D]'>{t('weightShort')}:</span>
            <span className='text-black font-medium'>{weightStr}</span>
            <span className='text-[#B3B3B3]'>|</span>
            <span className='text-[#4D4D4D]'>{t('volumeShort')}:</span>
            <span className='text-black font-medium'>{volumeStr}</span>
            <span className='text-[#B3B3B3]'>|</span>
            <span className='text-[#4D4D4D]'>{t('date')}:</span>
            <span className='text-black font-medium'>{dateDisplay}</span>
          </div>

          {/* Цена: название и значение */}
          <div className='mt-auto mb-1'>
            <span className='text-[#4D4D4D]'>{t('priceLabel')}:</span>
            <span className='text-black font-bold ml-1'>{priceStr}</span>
          </div>
          {/* Выставлено: Сегодня / дата */}
          <div>
            <span className='text-[#4D4D4D]'>{t('postedLabel')}:</span>
            <span className='text-black ml-1'>
              {isToday ? t('today') : dateDisplay}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

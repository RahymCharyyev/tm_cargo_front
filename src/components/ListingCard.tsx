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

function getLocationName(loc: { names: { en: string; ru: string; tk: string } } | null | undefined, locale: string): string {
  if (!loc) return '—';
  return (loc.names as unknown as Record<string, string>)[locale] || loc.names.en || loc.names.tk;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.');
}

export default function ListingCard({ listing }: Props) {
  const t = useTranslations('listing');
  const locale = useLocale();

  const mainImage = listing.images?.[0]?.filename
    ? `https://tm-cargo.com.tm/api/${listing.images[0].filename}`
    : null;

  const fromName = getLocationName(listing.from, locale);
  const toName = getLocationName(listing.to, locale);
  const route = `${fromName} — ${toName}`;
  const dateDisplay = formatDate(listing.createdAt);
  const postedDisplay = new Date(listing.createdAt).toDateString() === new Date().toDateString() ? 'Сегодня' : dateDisplay;

  const categoryName = t(listing.locationType);
  const senderName = listing.owner?.fullName || '—';
  const weightKg = listing.cargo?.weight_kg ?? listing.vehicle?.weight_kg ?? listing.load?.weight_kg;
  const volumeM3 = listing.cargo?.volume_m3 ?? listing.vehicle?.volume_m3;
  const weightStr = weightKg != null ? `${weightKg >= 1000 ? (weightKg / 1000).toFixed(0) : weightKg}${weightKg >= 1000 ? 'т' : ' кг'}` : '—';
  const volumeStr = volumeM3 != null ? `${volumeM3}м³` : '—';

  const currencyLabel = listing.currency ? currencySymbols[listing.currency] : 'TMT';
  const priceStr = listing.price != null ? `${listing.price.toLocaleString()} ${currencyLabel}` : '—';

  return (
    <Link href={`/listings/${listing.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg border border-gray-100 transition-all duration-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-[15px] text-[#171717] leading-[1.25] font-semibold line-clamp-2 mb-2">
            {listing.title}
          </h3>

          {/* Location with pin */}
          <div className="flex items-center gap-1.5 text-[#364860] text-[13px] mb-2.5">
            <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="truncate">{route}</span>
          </div>

          {/* Category | Sender */}
          <div className="flex items-center gap-x-2 gap-y-1 text-[13px] text-[#4b5563] overflow-hidden whitespace-nowrap">
            <span className="truncate">{t('categoryLabel')}: {categoryName}</span>
            <span className="text-gray-300 shrink-0">|</span>
            <span className="truncate">{t('sender')}: {senderName}</span>
          </div>
          <div className="flex items-center gap-x-2 gap-y-1 text-[13px] text-[#4b5563] pt-1 overflow-hidden whitespace-nowrap">
            <span>{t('weightShort')}: {weightStr}</span>
            <span className="text-gray-300"> {t('volumeShort')}: {volumeStr}</span>
            <span className="text-gray-300"> {t('date')}: {dateDisplay}</span>
          </div>

          {/* Price */}
          <div className="mt-3 pt-2 border-t border-gray-100 font-semibold text-[15px] text-[#171717]">
            {t('priceLabel')}: {priceStr}
          </div>
          <div className="mt-1 text-[13px] text-gray-500">
            {t('postedLabel')}: <span className="font-semibold text-gray-700">{postedDisplay}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

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
      <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 h-full flex flex-col">
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
          <h3 className="text-[14px] text-[#121212] leading-[1.25] font-semibold line-clamp-2 mb-2">
            {listing.title}
          </h3>

          {/* Location with pin */}
          <div className="flex items-center gap-1.5 text-[#364860] text-[13px] mb-2.5">
            <svg className="w-[15px] h-[15px] shrink-0 text-[#5b6470]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{route}</span>
          </div>

          {/* Details row: Category | Sender | Weight | Volume | Date */}
          <div className="flex items-center gap-x-2 gap-y-1 text-[13px] text-[#4b5563] border-t border-gray-200 pt-2.5 overflow-hidden whitespace-nowrap">
            <span className="truncate">{t('categoryLabel')}: {categoryName}</span>
            <span className="text-gray-300">|</span>
            <span className="truncate">{t('sender')}: {senderName}</span>
          </div>
          <div className="flex items-center gap-x-2 gap-y-1 text-[13px] text-[#4b5563] pt-1 overflow-hidden whitespace-nowrap">
            <span>{t('weightShort')}: {weightStr}</span>
            <span className="text-gray-300">|</span>
            <span>{t('volumeShort')}: {volumeStr}</span>
            <span className="text-gray-300">|</span>
            <span>{t('date')}: {dateDisplay}</span>
          </div>

          {/* Price at bottom */}
          <div className="mt-2.5 pt-2 border-t border-gray-200 font-medium text-[14px] text-[#1f2937]">
            {t('priceLabel')}: {priceStr}
          </div>
          <div className="mt-1 text-[13px] text-[#374151]">
            Выставлено: <span className="font-semibold">{postedDisplay}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

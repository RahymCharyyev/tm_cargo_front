'use client';

import { use } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useListing, useDeleteListing, useAddFavorite, useRemoveFavorite } from '@/lib/hooks';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from '@/i18n/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const currencySymbols: Record<string, string> = { manat: 'TMT', dollar: '$', euro: '€' };

function getName(names: { en: string; ru: string; tk: string } | undefined | null, locale: string): string {
  if (!names) return '—';
  return (names as unknown as Record<string, string>)[locale] || names.en || names.tk || '—';
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { data: listing, isLoading } = useListing(id);
  const deleteMutation = useDeleteListing();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();

  if (isLoading) return <LoadingSpinner />;
  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-900">{tc('noResults')}</h2>
      </div>
    );
  }

  const isOwner = user?.id === listing.userId;
  const fromName = listing.from ? getName(listing.from.names, locale) : '—';
  const toName = listing.to ? getName(listing.to.names, locale) : '—';
  const fromParent = listing.from?.parentNames ? getName(listing.from.parentNames, locale) : null;
  const toParent = listing.to?.parentNames ? getName(listing.to.parentNames, locale) : null;

  const handleDelete = () => {
    if (confirm(t('deleteConfirm'))) {
      deleteMutation.mutate(id, {
        onSuccess: () => router.push('/'),
      });
    }
  };

  const handleFavorite = () => {
    if (!isAuthenticated) return;
    if (listing.isFavorite) {
      removeFav.mutate(listing.id);
    } else {
      addFav.mutate(listing.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#3D7EF9]">{t('allListings')}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{listing.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      listing.type === 'cargo' ? 'bg-blue-100 text-blue-700' :
                      listing.type === 'vehicle' ? 'bg-green-100 text-green-700' :
                      listing.type === 'traveler' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {t(listing.type)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      listing.locationType === 'international' ? 'bg-red-50 text-red-600' :
                      listing.locationType === 'intercity' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-teal-50 text-teal-600'
                    }`}>
                      {t(listing.locationType)}
                    </span>
                    {listing.isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-600 font-medium">{tc('active')}</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 font-medium">{tc('inactive')}</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {isAuthenticated && (
                    <button
                      onClick={handleFavorite}
                      className={`p-2 rounded-xl transition-all ${
                        listing.isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <svg className="w-6 h-6" fill={listing.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Price */}
              {listing.price != null && (
                <div className="text-3xl font-bold text-[#3D7EF9] mb-4">
                  {listing.price.toLocaleString()} {listing.currency ? currencySymbols[listing.currency] : ''}
                </div>
              )}

              {/* Route */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">{tc('from')}</div>
                    <div className="font-semibold text-gray-900">{fromName}</div>
                    {fromParent && <div className="text-xs text-gray-500">{fromParent}</div>}
                  </div>
                  <div className="shrink-0">
                    <svg className="w-6 h-6 text-[#3D7EF9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-xs text-gray-500 mb-1">{tc('to')}</div>
                    <div className="font-semibold text-gray-900">{toName}</div>
                    {toParent && <div className="text-xs text-gray-500">{toParent}</div>}
                  </div>
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{tc('description')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}

              {/* Type-specific details */}
              <div className="grid grid-cols-2 gap-3">
                {listing.cargo && (
                  <>
                    {listing.cargo.weight_kg && (
                      <div className="bg-blue-50 rounded-xl p-3">
                        <div className="text-xs text-blue-600 mb-1">{t('weight')}</div>
                        <div className="font-semibold text-blue-900">{listing.cargo.weight_kg} kg</div>
                      </div>
                    )}
                    {listing.cargo.volume_m3 && (
                      <div className="bg-blue-50 rounded-xl p-3">
                        <div className="text-xs text-blue-600 mb-1">{t('volume')}</div>
                        <div className="font-semibold text-blue-900">{listing.cargo.volume_m3} m³</div>
                      </div>
                    )}
                    {listing.cargo.vehicleType && (
                      <div className="bg-blue-50 rounded-xl p-3 col-span-2">
                        <div className="text-xs text-blue-600 mb-1">{t('vehicleType')}</div>
                        <div className="font-semibold text-blue-900">{getName(listing.cargo.vehicleType.names, locale)}</div>
                      </div>
                    )}
                  </>
                )}
                {listing.vehicle && (
                  <>
                    {listing.vehicle.weight_kg && (
                      <div className="bg-green-50 rounded-xl p-3">
                        <div className="text-xs text-green-600 mb-1">{t('weight')}</div>
                        <div className="font-semibold text-green-900">{listing.vehicle.weight_kg} kg</div>
                      </div>
                    )}
                    {listing.vehicle.volume_m3 && (
                      <div className="bg-green-50 rounded-xl p-3">
                        <div className="text-xs text-green-600 mb-1">{t('volume')}</div>
                        <div className="font-semibold text-green-900">{listing.vehicle.volume_m3} m³</div>
                      </div>
                    )}
                    {listing.vehicle.vehicleType && (
                      <div className="bg-green-50 rounded-xl p-3 col-span-2">
                        <div className="text-xs text-green-600 mb-1">{t('vehicleType')}</div>
                        <div className="font-semibold text-green-900">{getName(listing.vehicle.vehicleType.names, locale)}</div>
                      </div>
                    )}
                  </>
                )}
                {listing.traveler && (
                  <>
                    <div className="bg-purple-50 rounded-xl p-3">
                      <div className="text-xs text-purple-600 mb-1">{t('travelerType')}</div>
                      <div className="font-semibold text-purple-900">{listing.traveler.travelerType === 'person' ? t('person') : t('vehicle')}</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3">
                      <div className="text-xs text-purple-600 mb-1">{t('bodyCount')}</div>
                      <div className="font-semibold text-purple-900">{listing.traveler.bodyCount}</div>
                    </div>
                  </>
                )}
                {listing.load && (
                  <>
                    <div className="bg-orange-50 rounded-xl p-3">
                      <div className="text-xs text-orange-600 mb-1">{t('loadType')}</div>
                      <div className="font-semibold text-orange-900">{listing.load.loadType === 'vehicle' ? t('vehicle') : t('load')}</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3">
                      <div className="text-xs text-orange-600 mb-1">{t('weight')}</div>
                      <div className="font-semibold text-orange-900">{listing.load.weight_kg} kg</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Images */}
            {listing.images && listing.images.length > 0 && (
              <div className="border-t border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('images')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.images.map((img) => (
                    <Image
                      key={img.id}
                      src={`https://tm-cargo.com.tm/api/${img.filename}`}
                      alt={listing.title}
                      width={100}
                      height={100}
                      crossOrigin='anonymous'
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {listing.viewCount} {tc('views')}
                </span>
                <span>{t('createdAt')}: {new Date(listing.createdAt).toLocaleDateString()}</span>
                {listing.dueDate && <span>{t('dueDate')}: {new Date(listing.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex gap-3">
              <Link
                href={`/listings/${id}/edit`}
                className="flex-1 text-center px-6 py-3 bg-[#3D7EF9] text-white rounded-xl font-medium hover:bg-[#2B529B] transition-colors"
              >
                {tc('edit')}
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-6 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                {tc('delete')}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('contactInfo')}</h3>
            <div className="space-y-3">
              {listing.owner && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3D7EF9] to-[#2B529B] flex items-center justify-center text-white font-bold text-sm">
                    {listing.owner.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{listing.owner.fullName || '—'}</div>
                    <div className="text-xs text-gray-500">{t('ownerInfo')}</div>
                  </div>
                </div>
              )}

              {(listing.phone || listing.owner?.phone) && (
                <a
                  href={`tel:${listing.phone || listing.owner?.phone}`}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{listing.phone || listing.owner?.phone}</span>
                </a>
              )}

              {(listing.email || listing.owner?.email) && (
                <a
                  href={`mailto:${listing.email || listing.owner?.email}`}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{listing.email || listing.owner?.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

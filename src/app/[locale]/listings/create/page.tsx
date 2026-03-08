'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCreateListing, useUploadListingImage } from '@/lib/hooks';
import { useRouter } from '@/i18n/navigation';
import LocationSelect from '@/components/LocationSelect';
import VehicleTypeSelect from '@/components/VehicleTypeSelect';
import Image from 'next/image';

const TYPES = ['cargo', 'vehicle', 'traveler', 'load'] as const;
const LOCATION_TYPES = ['international', 'intercity', 'local'] as const;
const CURRENCIES = ['manat', 'dollar', 'euro'] as const;

export default function CreateListingPage() {
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const router = useRouter();
  const createMutation = useCreateListing();
  const uploadImage = useUploadListingImage();

  const [form, setForm] = useState({
    title: '',
    type: '' as string,
    locationType: '' as string,
    fromLocationId: '',
    toLocationId: '',
    price: '',
    currency: 'manat',
    description: '',
    phone: '',
    email: '',
    dueDate: '',
    // Type specific
    weight_kg: '',
    volume_m3: '',
    vehicleTypeId: '',
    travelerType: 'person',
    bodyCount: '1',
    loadType: 'load',
  });

  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const body: Record<string, unknown> = {
      title: form.title,
      type: form.type,
      locationType: form.locationType,
      fromLocationId: form.fromLocationId,
      toLocationId: form.toLocationId,
      description: form.description || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      price: form.price ? Number(form.price) : undefined,
      currency: form.price ? form.currency : undefined,
      dueDate: form.dueDate || undefined,
    };

    // Type-specific fields
    if (form.type === 'cargo' || form.type === 'vehicle') {
      body.weight_kg = form.weight_kg ? Number(form.weight_kg) : undefined;
      body.volume_m3 = form.volume_m3 ? Number(form.volume_m3) : undefined;
      body.vehicleTypeId = form.vehicleTypeId || undefined;
    }
    if (form.type === 'traveler') {
      body.travelerType = form.travelerType;
      body.bodyCount = Number(form.bodyCount);
      body.vehicleTypeId = form.vehicleTypeId || undefined;
    }
    if (form.type === 'load') {
      body.loadType = form.loadType;
      body.weight_kg = form.weight_kg ? Number(form.weight_kg) : undefined;
      body.vehicleTypeId = form.vehicleTypeId || undefined;
    }

    createMutation.mutate(body, {
      onSuccess: async (res) => {
        // Upload images
        if (images.length > 0 && res.id) {
          for (const image of images) {
            await uploadImage.mutateAsync({ listingId: res.id, image });
          }
        }
        router.push(`/listings/${res.id}`);
      },
      onError: (err) => setError(err.message),
    });
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9] transition-colors bg-white";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('createTitle')}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('title')} *</label>
            <input type="text" value={form.title} onChange={(e) => updateForm('title', e.target.value)} required className={inputClass} />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('type')} *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TYPES.map((type) => (
                <button key={type} type="button" onClick={() => updateForm('type', type)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    form.type === type ? 'bg-[#3D7EF9] text-white border-[#3D7EF9] shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-[#3D7EF9]/50'
                  }`}>
                  {t(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('locationType')} *</label>
            <div className="grid grid-cols-3 gap-2">
              {LOCATION_TYPES.map((lt) => (
                <button key={lt} type="button" onClick={() => updateForm('locationType', lt)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    form.locationType === lt ? 'bg-[#3D7EF9] text-white border-[#3D7EF9] shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-[#3D7EF9]/50'
                  }`}>
                  {t(lt)}
                </button>
              ))}
            </div>
          </div>

          {/* Route */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('fromLocation')} *</label>
              <LocationSelect value={form.fromLocationId} onChange={(id) => updateForm('fromLocationId', id)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('toLocation')} *</label>
              <LocationSelect value={form.toLocationId} onChange={(id) => updateForm('toLocationId', id)} />
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tc('price')}</label>
              <input type="number" value={form.price} onChange={(e) => updateForm('price', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('currency')}</label>
              <select value={form.currency} onChange={(e) => updateForm('currency', e.target.value)} className={inputClass}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{tc('description')}</label>
            <textarea rows={4} value={form.description} onChange={(e) => updateForm('description', e.target.value)} className={inputClass} />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('dueDate')}</label>
            <input type="date" value={form.dueDate} onChange={(e) => updateForm('dueDate', e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Type-specific fields */}
        {(form.type === 'cargo' || form.type === 'vehicle') && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">{t(form.type as 'cargo' | 'vehicle')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('weight')}</label>
                <input type="number" value={form.weight_kg} onChange={(e) => updateForm('weight_kg', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('volume')}</label>
                <input type="number" value={form.volume_m3} onChange={(e) => updateForm('volume_m3', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('vehicleType')}</label>
              <VehicleTypeSelect value={form.vehicleTypeId} onChange={(id) => updateForm('vehicleTypeId', id)} />
            </div>
          </div>
        )}

        {form.type === 'traveler' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">{t('traveler')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('travelerType')}</label>
                <select value={form.travelerType} onChange={(e) => updateForm('travelerType', e.target.value)} className={inputClass}>
                  <option value="person">{t('person')}</option>
                  <option value="vehicle">{t('vehicle')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('bodyCount')}</label>
                <input type="number" min={1} value={form.bodyCount} onChange={(e) => updateForm('bodyCount', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('vehicleType')}</label>
              <VehicleTypeSelect value={form.vehicleTypeId} onChange={(id) => updateForm('vehicleTypeId', id)} />
            </div>
          </div>
        )}

        {form.type === 'load' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">{t('load')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('loadType')}</label>
                <select value={form.loadType} onChange={(e) => updateForm('loadType', e.target.value)} className={inputClass}>
                  <option value="load">{t('load')}</option>
                  <option value="vehicle">{t('vehicle')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('weight')}</label>
                <input type="number" value={form.weight_kg} onChange={(e) => updateForm('weight_kg', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('vehicleType')}</label>
              <VehicleTypeSelect value={form.vehicleTypeId} onChange={(id) => updateForm('vehicleTypeId', id)} />
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">{t('contactInfo')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tc('phone')}</label>
              <input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tc('email')}</label>
              <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('images')}</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[#3D7EF9] hover:file:bg-blue-100"
          />
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <Image crossOrigin='anonymous' src={URL.createObjectURL(img)} alt="" width={100} height={100} className="w-full h-24 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, index) => index !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 py-3 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-60"
          >
            {createMutation.isPending ? tc('loading') : tc('create')}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            {tc('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

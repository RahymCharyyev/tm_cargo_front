'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useLocations, type LocationData } from '@/lib/hooks';

interface Props {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

function getLocationName(loc: LocationData, locale: string): string {
  const name = (loc.names as unknown as Record<string, string>)[locale] || loc.names.en || loc.names.tk;
  if (loc.parent) {
    const parentName = (loc.parent.names as unknown as Record<string, string>)[locale] || loc.parent.names.en || loc.parent.names.tk;
    return `${name}, ${parentName}`;
  }
  return name;
}

export default function LocationSelect({ value, onChange, placeholder }: Props) {
  const t = useTranslations('listing');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data } = useLocations({ name: search || undefined, perPage: 20 });

  const selectedLocation = data?.data?.find((l) => l.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer text-sm hover:border-[#3D7EF9]/50 transition-colors"
      >
        {selectedLocation ? (
          <span className="text-gray-900">{getLocationName(selectedLocation, locale)}</span>
        ) : (
          <span className="text-gray-400">{placeholder || t('selectLocation')}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('selectLocation')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9]"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {data?.data?.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  onChange(loc.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                  loc.id === value ? 'bg-blue-50 text-[#3D7EF9] font-medium' : 'text-gray-700'
                }`}
              >
                {getLocationName(loc, locale)}
              </button>
            ))}
            {data?.data?.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                {t('selectLocation')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

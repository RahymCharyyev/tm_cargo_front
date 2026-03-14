'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useLocations, type LocationData } from '@/lib/hooks';

interface Props {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  wrapperClassName?: string;
  /** When provided, replaces ALL default trigger classes (only flex/cursor are added). */
  triggerClassName?: string;
  dropdownClassName?: string;
  searchInputClassName?: string;
  rightIcon?: ReactNode;
}

function getIconUrl(icon: string | null | undefined): string | null {
  if (!icon) return null;
  if (icon.startsWith('http')) return icon;
  return `https://tm-cargo.com.tm/api/${icon}`;
}

function getLocationFlag(loc: LocationData): string | null {
  return getIconUrl(loc.icon) ?? getIconUrl(loc.parent?.icon ?? null);
}

function getLocationName(loc: LocationData, locale: string): string {
  const name =
    (loc.names as unknown as Record<string, string>)[locale] ||
    loc.names.en ||
    loc.names.tk;
  if (loc.parent) {
    const parentName =
      (loc.parent.names as unknown as Record<string, string>)[locale] ||
      loc.parent.names.en ||
      loc.parent.names.tk;
    return `${name}, ${parentName}`;
  }
  return name;
}

export default function LocationSelect({
  value,
  onChange,
  placeholder,
  wrapperClassName,
  triggerClassName,
  dropdownClassName,
  searchInputClassName,
  rightIcon,
}: Props) {
  const t = useTranslations('listing');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data } = useLocations({ name: search || undefined, perPage: 20 });

  const selectedLocation = data?.data?.find((l) => l.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerClass = triggerClassName
    ? `flex items-center cursor-pointer ${triggerClassName}`
    : 'w-full h-9 px-3 flex items-center border border-gray-200 rounded-lg bg-white cursor-pointer text-[13px] hover:border-[#3D7EF9]/50 transition-colors';

  return (
    <div
      ref={wrapperRef}
      className={`relative ${wrapperClassName ?? ''}`.trim()}
    >
      <div onClick={() => setIsOpen(true)} className={triggerClass}>
        <span className='min-w-0 flex-1 flex items-center gap-2 truncate'>
          {selectedLocation ? (
            <>
              {getLocationFlag(selectedLocation) && (
                <Image
                  src={getLocationFlag(selectedLocation)!}
                  alt=''
                  width={22}
                  height={15}
                  className='w-[22px] h-[15px] object-cover rounded-[3px] shrink-0'
                  crossOrigin='anonymous'
                />
              )}
              <span className='truncate text-[#111827]'>
                {getLocationName(selectedLocation, locale)}
              </span>
            </>
          ) : (
            <span className='text-[#9CA3AF] truncate'>
              {placeholder || t('selectLocation')}
            </span>
          )}
        </span>
        {rightIcon ? (
          <span className='ml-2 shrink-0'>{rightIcon}</span>
        ) : null}
      </div>

      {isOpen && (
        <div
          className={`absolute z-[100] top-full mt-1 w-full bg-white rounded-lg border border-gray-100 overflow-hidden shadow-[0_8px_24px_rgba(125,148,176,0.25)] ${
            dropdownClassName ?? ''
          }`.trim()}
        >
          <div className='p-1.5'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('selectLocation')}
              className={`w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9] ${
                searchInputClassName ?? ''
              }`.trim()}
              autoFocus
            />
          </div>
          <div className='max-h-52 overflow-y-auto'>
            {data?.data?.map((loc) => {
              const flagUrl = getLocationFlag(loc);
              return (
                <button
                  key={loc.id}
                  type='button'
                  onClick={() => {
                    onChange(loc.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2.5 text-[14px] transition-colors flex items-center gap-2 ${
                    loc.id === value
                      ? 'bg-[#EAF2FC] text-[#2B5399] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {flagUrl ? (
                    <Image
                      src={flagUrl}
                      alt=''
                      width={22}
                      height={15}
                      className='w-[22px] h-[15px] object-cover rounded-[3px] shrink-0'
                      crossOrigin='anonymous'
                    />
                  ) : (
                    <span className='w-[22px] h-[15px] shrink-0 rounded-[3px] bg-gray-100' />
                  )}
                  <span className='truncate'>
                    {getLocationName(loc, locale)}
                  </span>
                </button>
              );
            })}
            {data?.data?.length === 0 && (
              <div className='px-3 py-2.5 text-[14px] text-gray-400 text-center'>
                {t('selectLocation')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

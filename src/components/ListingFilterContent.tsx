'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import LocationSelect from '@/components/LocationSelect';
import type { VehicleType } from '@/lib/hooks';

function getIconUrl(icon: string | null | undefined): string | null {
  if (!icon) return null;
  if (icon.startsWith('http')) return icon;
  return `https://tm-cargo.com.tm/api/${icon}`;
}

const LOCATION_TYPES = ['international', 'intercity', 'local'] as const;

const fieldLabelClass =
  'mb-2 block text-[14px] font-medium leading-none text-[#0F172A]';

const fieldClass =
  'h-[45px] w-full rounded-[15px] border border-white/80 bg-white px-5 shadow-[0_8px_24px_rgba(125,148,176,0.16)] outline-none transition text-[14px] placeholder:text-[#9CA3AF] focus:border-[#2B5399]/20 focus:ring-2 focus:ring-[#2B5399]/10';

const dropdownMenuClass =
  'absolute z-[100] top-full mt-1 w-full bg-white rounded-[15px] border border-[#D6E0EE] overflow-hidden shadow-[0_8px_24px_rgba(125,148,176,0.25)]';

interface ListingFilterContentProps {
  locationType: string;
  onLocationTypeChange: (value: string) => void;
  from: string;
  onFromChange: (value: string) => void;
  to: string;
  onToChange: (value: string) => void;
  weight: string;
  onWeightChange: (value: string) => void;
  volume: string;
  onVolumeChange: (value: string) => void;
  executionDate: string;
  onExecutionDateChange: (value: string) => void;
  kind: string;
  onKindChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  senderSelected: boolean;
  onSenderToggle: () => void;
  carrierSelected: boolean;
  onCarrierToggle: () => void;
  vehicleTypes?: VehicleType[];
  onClear: () => void;
  onApply: () => void;
  className?: string;
}

function ChevronDownIcon() {
  return (
    <svg
      className='h-5 w-5 shrink-0 text-[#6B7280]'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M5 7.5L10 12.5L15 7.5'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className='h-5 w-5 shrink-0 text-[#9CA3AF]'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M14.167 14.1667L17.5 17.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.75 15C12.2018 15 15 12.2018 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

interface DropdownOption {
  value: string;
  label: string;
  icon?: string | null;
}

function FilterDropdown({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: DropdownOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className='relative'>
      <label className={fieldLabelClass}>{label}</label>
      <button
        type='button'
        onClick={() => setIsOpen((v) => !v)}
        className={`${fieldClass} flex items-center gap-2 text-left cursor-pointer`}
      >
        <span className='min-w-0 flex-1 flex items-center gap-2 truncate'>
          {selected?.icon && (
            <Image
              src={selected.icon}
              alt=''
              width={22}
              height={22}
              className='w-[22px] h-[22px] object-contain shrink-0'
              crossOrigin='anonymous'
            />
          )}
          {selected ? (
            <span className='text-[#111827] truncate'>{selected.label}</span>
          ) : (
            <span className='text-[#9CA3AF]'>{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className={dropdownMenuClass}>
          <div className='max-h-52 overflow-y-auto py-1'>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[14px] transition-colors flex items-center gap-2 ${
                  option.value === value
                    ? 'bg-[#EAF2FC] text-[#2B5399] font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.icon ? (
                  <Image
                    src={option.icon}
                    alt=''
                    width={22}
                    height={22}
                    className='w-[22px] h-[22px] object-contain shrink-0'
                    crossOrigin='anonymous'
                  />
                ) : option.value !== '' ? (
                  <span className='w-[22px] h-[22px] shrink-0' />
                ) : null}
                <span className='truncate'>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterToggle({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={checked}
      className='inline-flex items-center gap-2 text-[15px] font-medium text-[#111827]'
    >
      <span
        className={`flex h-[24px] w-[24px] items-center justify-center rounded-[5px] border-2 transition-colors ${
          checked ? 'border-[#385B97] bg-[#E3ECFA]' : 'border-[#2F3A4A] bg-white'
        }`}
      >
        <span
          className={`h-[14px] w-[14px] rounded-[3px] transition-colors ${
            checked ? 'bg-[#385B97]' : 'bg-transparent'
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

function getTypeName(vehicleType: VehicleType, locale: string): string {
  return (
    (vehicleType.names as unknown as Record<string, string>)[locale] ||
    vehicleType.names.en ||
    vehicleType.names.tk
  );
}

export default function ListingFilterContent({
  locationType,
  onLocationTypeChange,
  from,
  onFromChange,
  to,
  onToChange,
  weight,
  onWeightChange,
  volume,
  onVolumeChange,
  executionDate,
  onExecutionDateChange,
  kind,
  onKindChange,
  sort,
  onSortChange,
  senderSelected,
  onSenderToggle,
  carrierSelected,
  onCarrierToggle,
  vehicleTypes,
  onClear,
  onApply,
  className,
}: ListingFilterContentProps) {
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const locale = useLocale();

  return (
    <section className={`w-full ${className ?? ''}`.trim()}>
      <div className='mb-5 flex items-center justify-between gap-4'>
        <h2 className='flex items-center gap-2 text-[18px] font-semibold text-[#264A84]'>
          <Image src='/Options.svg' alt='filter' width={24} height={24} />
          <span>{t('filter')}</span>
        </h2>
        <button
          type='button'
          onClick={onClear}
          className='text-[14px] font-medium text-[#C53939] transition-colors hover:text-[#A82F2F]'
        >
          {t('clearFilters')}
        </button>
      </div>

      <div className='space-y-4'>
        {/* Категория */}
        <FilterDropdown
          label={t('category')}
          value={locationType}
          onChange={onLocationTypeChange}
          placeholder={tc('all')}
          options={[
            { value: '', label: tc('all') },
            ...LOCATION_TYPES.map((lt) => ({ value: lt, label: t(lt) })),
          ]}
        />

        {/* Чекбоксы Отправитель / Доставщик */}
        <div className='flex flex-wrap gap-6'>
          <FilterToggle
            label={t('sender')}
            checked={senderSelected}
            onClick={onSenderToggle}
          />
          <FilterToggle
            label={t('carrier')}
            checked={carrierSelected}
            onClick={onCarrierToggle}
          />
        </div>

        {/* Откуда */}
        <div>
          <label className={fieldLabelClass}>{tc('from')}</label>
          <LocationSelect
            value={from}
            onChange={onFromChange}
            placeholder={t('enterLocation')}
            triggerClassName={fieldClass}
            dropdownClassName='rounded-[15px] border-[#D6E0EE]'
            searchInputClassName='rounded-[10px] border-[#D6E0EE] px-3 py-2 text-[14px]'
            rightIcon={<SearchIcon />}
          />
        </div>

        {/* Куда */}
        <div>
          <label className={fieldLabelClass}>{t('toLocation')}</label>
          <LocationSelect
            value={to}
            onChange={onToChange}
            placeholder={t('enterLocation')}
            triggerClassName={fieldClass}
            dropdownClassName='rounded-[15px] border-[#D6E0EE]'
            searchInputClassName='rounded-[10px] border-[#D6E0EE] px-3 py-2 text-[14px]'
            rightIcon={<SearchIcon />}
          />
        </div>

        {/* Вес */}
        <div>
          <label className={fieldLabelClass}>{t('weightTons')}</label>
          <input
            type='number'
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder={t('weightNotEntered')}
            className={fieldClass}
            min='0'
            step='0.1'
          />
        </div>

        {/* Объём */}
        <div>
          <label className={fieldLabelClass}>{t('volumeM3')}</label>
          <input
            type='number'
            value={volume}
            onChange={(e) => onVolumeChange(e.target.value)}
            placeholder={t('volumeNotEntered')}
            className={fieldClass}
            min='0'
            step='0.1'
          />
        </div>

        {/* Тип кузова */}
        <FilterDropdown
          label={t('bodyType')}
          value={kind}
          onChange={onKindChange}
          placeholder={tc('all')}
          options={[
            { value: '', label: tc('all') },
            ...(vehicleTypes?.map((vt) => ({
              value: vt.id,
              label: getTypeName(vt, locale),
              icon: getIconUrl(vt.icon),
            })) ?? []),
          ]}
        />

        {/* Дата исполнения */}
        <div>
          <label className={fieldLabelClass}>{t('executionDate')}</label>
          <input
            type='date'
            value={executionDate}
            onChange={(e) => onExecutionDateChange(e.target.value)}
            className={`${fieldClass} cursor-pointer [color-scheme:light]`}
          />
        </div>

        {/* Сортировка */}
        <FilterDropdown
          label={tc('sort')}
          value={sort}
          onChange={onSortChange}
          placeholder={t('selectSort')}
          options={[
            { value: '', label: t('selectSort') },
            { value: 'newest', label: t('newest') },
            { value: 'oldest', label: t('oldest') },
            { value: 'price_asc', label: t('priceLowHigh') },
            { value: 'price_desc', label: t('priceHighLow') },
          ]}
        />

        <button
          type='button'
          onClick={onApply}
          className='mt-1 h-[52px] w-full rounded-[18px] bg-[#2F5AA6] text-[16px] font-semibold text-white transition-colors hover:bg-[#274B8A]'
        >
          {t('apply')}
        </button>
      </div>
    </section>
  );
}

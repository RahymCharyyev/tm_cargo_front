'use client';

import { Button, Checkbox, DatePicker, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import LocationSelect from '@/components/LocationSelect';
import type { VehicleType } from '@/lib/hooks';

function getIconUrl(icon: string | null | undefined): string | null {
  if (!icon) return null;
  if (icon.startsWith('http')) return icon;
  return `https://tm-cargo.com.tm/api/${icon}`;
}

const FILTER_CATEGORIES = [
  'international',
  'intercity',
  'local',
  'traveler',
  'load',
] as const;

type FilterCategory = (typeof FILTER_CATEGORIES)[number] | '';

function getSubcategoryLabels(
  cat: string,
  t: (key: string) => string,
): { label1: string; label2: string } | null {
  if (cat === 'traveler') {
    return { label1: t('filterSubPassenger'), label2: t('filterSubCar') };
  }
  return { label1: t('sender'), label2: t('carrier') };
}

function getTypeName(vehicleType: VehicleType, locale: string): string {
  return (
    (vehicleType.names as unknown as Record<string, string>)[locale] ||
    vehicleType.names.en ||
    vehicleType.names.tk
  );
}

interface ListingFilterContentProps {
  category: FilterCategory;
  onCategoryChange: (value: FilterCategory) => void;
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
  onClose?: () => void;
  className?: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-[#0F172A]';

export default function ListingFilterContent({
  category,
  onCategoryChange,
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
  onClose,
  className,
}: ListingFilterContentProps) {
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const locale = useLocale();

  const categoryOptions = [
    { value: '' as FilterCategory, label: tc('all') },
    ...FILTER_CATEGORIES.map((cat) => ({
      value: cat,
      label: t(`filterCat${cat.charAt(0).toUpperCase()}${cat.slice(1)}` as never),
    })),
  ];

  const vehicleTypeOptions = [
    { value: '', label: tc('all') },
    ...(vehicleTypes?.map((vt) => {
      const icon = getIconUrl(vt.icon);
      return {
        value: vt.id,
        label: getTypeName(vt, locale),
        icon,
      };
    }) ?? []),
  ];

  const sortOptions = [
    { value: '', label: t('selectSort') },
    { value: 'newest', label: t('newest') },
    { value: 'oldest', label: t('oldest') },
    { value: 'price_asc', label: t('priceLowHigh') },
    { value: 'price_desc', label: t('priceHighLow') },
  ];

  const subLabels = getSubcategoryLabels(category, t as (key: string) => string);

  return (
    <section
      className={`w-full rounded-[24px] bg-[#EAF2FC] p-4 sm:p-5 ${className ?? ''}`.trim()}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#264A84]">
          <Image src="/Options.svg" alt="filter" width={24} height={24} />
          <span>{t('filter')}</span>
        </h2>
        <div className="flex items-center gap-3">
          <Button
            type="link"
            danger
            size="small"
            onClick={onClear}
            className="!p-0 !text-[#C53939] hover:!text-[#A82F2F] font-medium"
          >
            {t('clearFilters')}
          </Button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/70 text-[#364860] hover:bg-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className={labelClass}>{t('category')}</label>
          <Select
            value={category}
            onChange={(val) => onCategoryChange(val as FilterCategory)}
            options={categoryOptions}
            style={{ width: '100%' }}
          />
        </div>

        {/* Subcategory checkboxes — labels change per category */}
        {subLabels && (
          <div className="flex flex-wrap gap-6">
            <Checkbox checked={senderSelected} onChange={onSenderToggle}>
              <span className="text-[15px] font-medium text-[#111827]">{subLabels.label1}</span>
            </Checkbox>
            <Checkbox checked={carrierSelected} onChange={onCarrierToggle}>
              <span className="text-[15px] font-medium text-[#111827]">{subLabels.label2}</span>
            </Checkbox>
          </div>
        )}

        {/* From */}
        <div>
          <label className={labelClass}>{tc('from')}</label>
          <LocationSelect
            value={from}
            onChange={onFromChange}
            placeholder={t('enterLocation')}
          />
        </div>

        {/* To */}
        <div>
          <label className={labelClass}>{t('toLocation')}</label>
          <LocationSelect
            value={to}
            onChange={onToChange}
            placeholder={t('enterLocation')}
          />
        </div>

        {/* Weight */}
        <div>
          <label className={labelClass}>{t('weightTons')}</label>
          <InputNumber
            value={weight ? Number(weight) : undefined}
            onChange={(val) => onWeightChange(val?.toString() ?? '')}
            placeholder={t('weightNotEntered')}
            min={0}
            step={0.1}
            style={{ width: '100%' }}
          />
        </div>

        {/* Volume */}
        <div>
          <label className={labelClass}>{t('volumeM3')}</label>
          <InputNumber
            value={volume ? Number(volume) : undefined}
            onChange={(val) => onVolumeChange(val?.toString() ?? '')}
            placeholder={t('volumeNotEntered')}
            min={0}
            step={0.1}
            style={{ width: '100%' }}
          />
        </div>

        {/* Body type */}
        <div>
          <label className={labelClass}>{t('bodyType')}</label>
          <Select
            value={kind || ''}
            onChange={onKindChange}
            options={vehicleTypeOptions}
            optionRender={(option) => {
              const icon = (option.data as { icon?: string | null }).icon;
              return (
                <div className="flex items-center gap-2">
                  {icon ? (
                    <Image
                      src={icon}
                      alt=""
                      width={22}
                      height={22}
                      className="w-[22px] h-[22px] object-contain shrink-0"
                      crossOrigin="anonymous"
                      unoptimized
                    />
                  ) : option.value ? (
                    <span className="w-[22px] h-[22px] shrink-0 inline-block" />
                  ) : null}
                  <span>{option.label as string}</span>
                </div>
              );
            }}
            style={{ width: '100%' }}
          />
        </div>

        {/* Execution date */}
        <div>
          <label className={labelClass}>{t('executionDate')}</label>
          <DatePicker
            value={executionDate ? dayjs(executionDate) : null}
            onChange={(date) => onExecutionDateChange(date ? date.format('YYYY-MM-DD') : '')}
            format="DD.MM.YYYY"
            style={{ width: '100%' }}
          />
        </div>

        {/* Sort */}
        <div>
          <label className={labelClass}>{tc('sort')}</label>
          <Select
            value={sort || ''}
            onChange={onSortChange}
            options={sortOptions}
            style={{ width: '100%' }}
          />
        </div>

        <Button
          type="primary"
          block
          size="large"
          onClick={onApply}
          style={{
            marginTop: 4,
            height: 52,
            borderRadius: 18,
            backgroundColor: '#2F5AA6',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {t('apply')}
        </Button>
      </div>
    </section>
  );
}

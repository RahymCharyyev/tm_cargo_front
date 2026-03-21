'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Select } from 'antd';
import { useLocations, type LocationData } from '@/lib/hooks';

interface Props {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
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
  className,
  style,
}: Props) {
  const t = useTranslations('listing');
  const locale = useLocale();
  const [search, setSearch] = useState('');

  const { data, isFetching } = useLocations({
    name: search || undefined,
    perPage: 20,
  });

  const options =
    data?.data?.map((loc) => ({
      value: loc.id,
      label: getLocationName(loc, locale),
      loc,
    })) ?? [];

  return (
    <Select
      allowClear
      value={value || undefined}
      showSearch={{
        filterOption: false,
        onSearch: setSearch,
      }}
      onChange={(val) => onChange(val ?? '')}
      placeholder={placeholder || t('selectLocation')}
      loading={isFetching}
      className={className}
      style={{ width: '100%', ...style }}
      optionRender={(option) => {
        const loc = (option.data as { loc: LocationData }).loc;
        const flagUrl = getLocationFlag(loc);
        return (
          <div className='flex items-center gap-2'>
            {flagUrl ? (
              <Image
                src={flagUrl}
                alt=''
                width={22}
                height={15}
                className='w-[22px] h-[15px] object-cover rounded-[3px] shrink-0'
                crossOrigin='anonymous'
                unoptimized
              />
            ) : (
              <span className='w-[22px] h-[15px] shrink-0 rounded-[3px] bg-gray-100 inline-block' />
            )}
            <span className='truncate'>{option.label as string}</span>
          </div>
        );
      }}
      labelRender={(props) => {
        const loc = data?.data?.find((l) => l.id === props.value);
        if (!loc) return <span>{props.label as string}</span>;
        const flagUrl = getLocationFlag(loc);
        return (
          <div className='flex items-center gap-2'>
            {flagUrl && (
              <Image
                src={flagUrl}
                alt=''
                width={22}
                height={15}
                className='w-[22px] h-[15px] object-cover rounded-[3px] shrink-0'
                crossOrigin='anonymous'
                unoptimized
              />
            )}
            <span className='truncate'>{getLocationName(loc, locale)}</span>
          </div>
        );
      }}
      options={options}
      notFoundContent={isFetching ? null : t('selectLocation')}
    />
  );
}

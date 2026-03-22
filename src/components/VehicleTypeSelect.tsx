'use client';

import { Select } from 'antd';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useVehicleTypes, type VehicleType } from '@/lib/hooks';

interface Props {
  value?: string;
  onChange?: (id: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getIconUrl(icon: string | null | undefined): string | null {
  if (!icon) return null;
  if (typeof icon !== 'string') return null;
  if (icon.startsWith('http')) return icon;
  return `https://tm-cargo.com.tm/api/${icon}`;
}

export default function VehicleTypeSelect({ value, onChange, placeholder, className, style }: Props) {
  const t = useTranslations('listing');
  const locale = useLocale();
  const { data } = useVehicleTypes({ perPage: 100 });

  const getName = (vt: VehicleType) =>
    (vt.names as unknown as Record<string, string>)[locale] || vt.names.en || vt.names.tk;

  const options = data?.data?.map((vt) => ({
    value: vt.id,
    label: getName(vt),
    icon: getIconUrl(vt.icon),
  })) ?? [];

  return (
    <Select
      allowClear
      value={value || undefined}
      onChange={(val) => onChange?.(val ?? '')}
      placeholder={placeholder || t('vehicleType')}
      options={options}
      className={className}
      style={{ width: '100%', ...style }}
      optionRender={(option) => {
        const icon = (option.data as { icon?: string | null }).icon;
        return (
          <div className='flex items-center gap-2'>
            {icon ? (
              <Image
                src={icon}
                alt=''
                width={22}
                height={22}
                className='w-[22px] h-[22px] object-contain shrink-0'
                crossOrigin='anonymous'
                unoptimized
              />
            ) : option.value ? (
              <span className='w-[22px] h-[22px] shrink-0 inline-block' />
            ) : null}
            <span>{option.label as string}</span>
          </div>
        );
      }}
      labelRender={(props) => {
        const vt = data?.data?.find((v) => v.id === props.value);
        if (!vt) return <span>{props.label as string}</span>;
        const icon = getIconUrl(vt.icon);
        return (
          <div className='flex items-center gap-2'>
            {icon && (
              <Image
                src={icon}
                alt=''
                width={22}
                height={22}
                className='w-[22px] h-[22px] object-contain shrink-0'
                crossOrigin='anonymous'
                unoptimized
              />
            )}
            <span>{getName(vt)}</span>
          </div>
        );
      }}
    />
  );
}

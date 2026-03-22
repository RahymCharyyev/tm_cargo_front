'use client';

import { Select } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useVehicleTypes, type VehicleType } from '@/lib/hooks';

interface Props {
  value?: string;
  onChange?: (id: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
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
    />
  );
}

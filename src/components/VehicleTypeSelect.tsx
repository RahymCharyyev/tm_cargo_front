'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useVehicleTypes, type VehicleType } from '@/lib/hooks';

interface Props {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

export default function VehicleTypeSelect({ value, onChange, placeholder }: Props) {
  const t = useTranslations('listing');
  const locale = useLocale();
  const { data } = useVehicleTypes({ perPage: 100 });

  const getName = (vt: VehicleType) =>
    (vt.names as unknown as Record<string, string>)[locale] || vt.names.en || vt.names.tk;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9] transition-colors"
    >
      <option value="">{placeholder || t('vehicleType')}</option>
      {data?.data?.map((vt) => (
        <option key={vt.id} value={vt.id}>
          {getName(vt)}
        </option>
      ))}
    </select>
  );
}

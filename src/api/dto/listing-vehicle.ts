import {z} from 'zod';
import {vehicleTypeDto} from './vehicle-type';

export const vehicleDto = z.object({
  listingId: z.string().uuid(),
  vehicleTypeId: z.string().uuid().nullish(),
  volume_m3: z.coerce.number().int().nullish(),
  weight_kg: z.coerce.number().int().nullish(),
});

export const vehicleExtra = z.object({
  vehicleType: vehicleTypeDto.pick({names: true, icon: true, isSpecial: true}).nullish(),
});

export type Vehicle = z.infer<typeof vehicleDto>;

export const addVehicle = vehicleDto.pick({listingId: true, vehicleTypeId: true, volume_m3: true, weight_kg: true});
export type AddVehicle = z.infer<typeof addVehicle>;

export const editVehicle = vehicleDto.pick({vehicleTypeId: true, volume_m3: true, weight_kg: true}).partial();
export type EditVehicle = z.infer<typeof editVehicle>;

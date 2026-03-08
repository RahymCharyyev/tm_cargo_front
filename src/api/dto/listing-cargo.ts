import {z} from 'zod';
import {vehicleTypeDto} from './vehicle-type';

export const cargoDto = z.object({
  listingId: z.string().uuid(),
  vehicleTypeId: z.string().uuid().nullish(),
  volume_m3: z.coerce.number().int().nullish(),
  weight_kg: z.coerce.number().int().nullish(),
});

export const cargoExtra = z.object({
  vehicleType: vehicleTypeDto.pick({names: true, icon: true, isSpecial: true}).nullish(),
});

export type Cargo = z.infer<typeof cargoDto>;

export const addCargo = cargoDto.pick({listingId: true, vehicleTypeId: true, volume_m3: true, weight_kg: true});
export type AddCargo = z.infer<typeof addCargo>;

export const editCargo = cargoDto.pick({vehicleTypeId: true, volume_m3: true, weight_kg: true}).partial();
export type EditCargo = z.infer<typeof editCargo>;

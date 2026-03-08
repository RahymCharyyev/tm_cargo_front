import {z} from 'zod';
import {vehicleTypeDto} from './vehicle-type';

export const loadDto = z.object({
  listingId: z.string().uuid(),
  loadType: z.enum(['vehicle', 'load']),
  weight_kg: z.coerce.number().int(),
  vehicleTypeId: z.string().uuid().nullish(),
});

export const loadExtra = z.object({
  vehicleType: vehicleTypeDto.pick({names: true, icon: true, isSpecial: true}).nullish(),
});

export type Load = z.infer<typeof loadDto>;

export const addLoad = loadDto.pick({weight_kg: true, listingId: true, loadType: true, vehicleTypeId: true});
export type AddLoad = z.infer<typeof addLoad>;

export const editLoad = loadDto.pick({loadType: true, weight_kg: true, vehicleTypeId: true}).partial();
export type EditLoad = z.infer<typeof editLoad>;

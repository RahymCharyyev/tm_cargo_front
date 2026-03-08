import {z} from 'zod';
import {vehicleTypeDto} from './vehicle-type';

export const travelerDto = z.object({
  listingId: z.string().uuid(),
  travelerType: z.enum(['vehicle', 'person']),
  bodyCount: z.coerce.number().int(),
  vehicleTypeId: z.string().uuid().nullish(),
});

export const travelerExtra = z.object({
  vehicleType: vehicleTypeDto.pick({names: true, icon: true, isSpecial: true}).nullish(),
});

export type Traveler = z.infer<typeof travelerDto>;

export const addTraveler = travelerDto.pick({
  bodyCount: true,
  listingId: true,
  travelerType: true,
  vehicleTypeId: true,
});
export type AddTraveler = z.infer<typeof addTraveler>;

export const editTraveler = travelerDto.pick({bodyCount: true, travelerType: true, vehicleTypeId: true}).partial();
export type EditTraveler = z.infer<typeof editTraveler>;

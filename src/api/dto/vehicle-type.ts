import {z} from 'zod';
import {commonQuery, names, namesString, strBool} from './common';

export const vehicleTypeDto = z.object({
  id: z.string().uuid(),
  names: names,
  icon: z.any().optional(),
  isSpecial: strBool,
  createdAt: z.coerce.date(),
});

export type VehicleTypeDto = z.infer<typeof vehicleTypeDto>;

export const getVehicleTypes = vehicleTypeDto.pick({id: true}).extend({name: z.string()}).partial().merge(commonQuery);
export type GetVehicleTypes = z.infer<typeof getVehicleTypes>;

export const getVehicleTypesRes = z.object({
  count: z.number(),
  data: vehicleTypeDto.array(),
});

export const getVehicleTypeRes = vehicleTypeDto.optional();

export const addVehicleType = vehicleTypeDto.pick({icon: true}).extend({names: namesString});
export type AddVehicleType = z.infer<typeof addVehicleType>;

export const editVehicleType = vehicleTypeDto.pick({icon: true}).extend({names: namesString}).partial();
export type EditVehicleType = z.infer<typeof editVehicleType>;

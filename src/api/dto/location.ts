import {z} from 'zod';
import {commonQuery, names, namesString} from './common';

export const keywords = z.coerce.string().array().nullish()

export const parentDto = z.object({
  id: z.string().uuid(),
  names: names,
  icon: z.string().nullish(),
  level: z.coerce.number().int(),
  isoCode: z.string().nullish(),
  parentId: z.string().uuid().nullable().optional(),
  createdAt: z.coerce.date(),
  keywords,
});

export const locationDto = z.object({
  id: z.string().uuid(),
  names: names,
  icon: z.string().nullish(),
  level: z.coerce.number().int(),
  isoCode: z.string().nullish(),
  parentId: z.string().uuid().nullable().optional(),
  parent: parentDto.nullable().optional(),
  createdAt: z.coerce.date(),
});

export type LocationDto = z.infer<typeof locationDto>;

export const getLocations = locationDto
  .pick({parentId: true, isoCode: true, level: true})
  .extend({name: z.string()})
  .partial()
  .merge(commonQuery);
export type GetLocations = z.infer<typeof getLocations>;

export const getLocationsRes = z.object({
  count: z.number(),
  data: locationDto.extend({hasChild: z.any(), keywords}).array(),
});

export const getLocationRes = locationDto.extend({hasChild: z.any(), keywords}).optional();

export const addLocation = locationDto.pick({parentId: true}).extend({
  names: namesString,
  icon: z.any().optional(),
});
export type AddLocation = z.infer<typeof addLocation>;

export const editLocation = locationDto
  .pick({parentId: true})
  .extend({names: namesString, icon: z.any().optional()})
  .partial();
export type EditLocation = z.infer<typeof editLocation>;

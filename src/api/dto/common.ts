import {z} from 'zod';

export const phoneVerification = z.enum(['authWaiting', 'authVerified', 'listingWaiting', 'listingVerified']);

export const sortDirection = z.enum(['asc', 'desc']);

export const names = z.object({
  en: z.string(),
  ru: z.string(),
  tk: z.string(),
});

export const namesString = z.string().transform(v => names.parse(JSON.parse(v)));

export const langs = names.keyof();

export const result = z.object({success: z.boolean()});

export const getAllCommon = z.object({
  count: z.number().int(),
});

export const strBool = z.union([z.enum(['true', 'false']), z.boolean()]).transform(v => v === 'true' || v === true);
export type StrBool = z.infer<typeof strBool>;

export const strInt = z
  .union([z.string(), z.number().int()])
  .refine(v => Number.isInteger(+v))
  .transform(v => +v);
export type StrInt = z.infer<typeof strInt>;

export const strNumber = z
  .union([z.string(), z.number()])
  .refine(v => !isNaN(+v))
  .transform(v => +v);
export type StrNumber = z.infer<typeof strNumber>;

export const uuid = z.string().uuid();
export const uuidArr = z.string().transform(v => v.split(','));

export const lang = z.enum(['tm', 'ru']).default('tm');
export type Lang = z.infer<typeof lang>;

export const commonQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().max(100).default(20),
});

export type CommonQuery = z.infer<typeof commonQuery>;

export const limitOffset = (d: CommonQuery) => ({
  offset: (d.page - 1) * d.perPage,
  limit: d.perPage,
});
export type LimitOffset = {limit: number; offset: number};

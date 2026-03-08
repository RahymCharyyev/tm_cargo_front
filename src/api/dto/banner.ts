import {z} from 'zod';
import {commonQuery, strBool} from './common';

export const bannerDto = z.object({
  id: z.string().uuid(),

  link: z.string().url().nullable(),
  image: z.string(),
  dueDate: z.coerce.date().nullable(),
  location: z.enum(['top', 'inside', 'list', 'sidebar']),
  order: z.coerce.number().int(),
  isActive: strBool,

  createdAt: z.coerce.date(),
});
export type BannerDto = z.infer<typeof bannerDto>;

export const getBanners = bannerDto.pick({id: true, location: true, isActive: true}).partial().merge(commonQuery);
export type GetBanners = z.infer<typeof getBanners>;
export const getBannersRes = z.object({
  count: z.number(),
  data: bannerDto.array(),
});

export const addBanner = bannerDto
  .pick({link: true, dueDate: true, location: true, order: true})
  .extend({image: z.any()});
export type AddBanner = z.infer<typeof addBanner>;

export const editBanner = bannerDto
  .pick({link: true, dueDate: true, location: true, order: true, isActive: true})
  .extend({image: z.any()})
  .partial();
export type EditBanner = z.infer<typeof editBanner>;

export const getBannerRes = bannerDto;

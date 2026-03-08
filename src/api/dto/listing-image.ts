import {z} from 'zod';
import {commonQuery} from './common';

export const listingImageDto = z.object({
  id: z.string().uuid(),
  listingId: z.string().uuid(),
  filename: z.string().max(255),
  createdAt: z.coerce.date(),
});

export const getListingImages = listingImageDto.pick({listingId: true, id: true}).partial().merge(commonQuery);
export const getListingImagesRes = z.object({
  count: z.number(),
  data: listingImageDto.array(),
});

export const addListingImage = listingImageDto.pick({listingId: true}).extend({image: z.any()});

export const getListingImageRes = listingImageDto.nullish();

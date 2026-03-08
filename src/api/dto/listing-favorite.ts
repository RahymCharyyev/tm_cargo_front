import {z} from 'zod';
import {commonQuery} from './common';
import {getListingRes} from './listing';

export const listingFavoriteDto = z.object({
  listingId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const getListingFavorites = listingFavoriteDto.partial().merge(commonQuery);
export const getListingFavoritesRes = z.object({
  count: z.number(),
  data: listingFavoriteDto.extend({listing: getListingRes.nullish()}).array(),
});

export const addListingFavorite = listingFavoriteDto.pick({listingId: true});

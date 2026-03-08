import {initContract, ServerInferRequest} from '@ts-rest/core';
import {z} from 'zod';
import {result} from '../dto/common';
import {addListingFavorite, getListingFavorites, getListingFavoritesRes} from '../dto/listing-favorite';

const c = initContract();

export const listingFavoriteContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getListingFavorites,
      responses: {200: getListingFavoritesRes},
    },
    create: {
      method: 'POST',
      path: '',
      body: addListingFavorite,
      responses: {201: result},
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {201: result},
    },
  },
  {
    pathPrefix: '/listing-favorites',
  },
);

export type ListingFavoriteReq = ServerInferRequest<typeof listingFavoriteContract>;

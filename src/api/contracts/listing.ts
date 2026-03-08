import {initContract, ServerInferRequest} from '@ts-rest/core';
import {z} from 'zod';
import {result} from '../dto/common';
import {addListing, editListing, getListingRes, getListings, getListingsRes, listingDto} from '../dto/listing';

const c = initContract();

export const listingContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getListings,
      responses: {200: getListingsRes},
    },
    create: {
      method: 'POST',
      path: '',
      body: addListing,
      responses: {201: result.merge(listingDto.pick({id: true}))},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getListingRes},
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      body: editListing,
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
    pathPrefix: '/listings',
  },
);

export const adminListingContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getListings,
      responses: {200: getListingsRes},
    },
    create: {
      method: 'POST',
      path: '',
      body: addListing,
      responses: {201: result},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getListingRes},
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      body: editListing,
      responses: {200: result},
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {201: result},
    },
  },
  {
    pathPrefix: '/listings',
  },
);

export type ListingReq = ServerInferRequest<typeof listingContract>;
export type AdminListingReq = ServerInferRequest<typeof adminListingContract>;

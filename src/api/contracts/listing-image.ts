import {initContract, ServerInferRequest} from '@ts-rest/core';
import {z} from 'zod';
import {result} from '../dto/common';
import {addListingImage, getListingImageRes, getListingImages, getListingImagesRes} from '../dto/listing-image';

const c = initContract();

export const listingImageContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getListingImages,
      responses: {200: getListingImagesRes},
    },
    create: {
      method: 'POST',
      path: '',
      body: addListingImage,
      responses: {201: result},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getListingImageRes},
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {201: result},
    },
  },
  {
    pathPrefix: '/listing-images',
  },
);

export type ListingImageReq = ServerInferRequest<typeof listingImageContract>;

export const listingImageAdminContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getListingImages,
      responses: {200: getListingImagesRes},
    },
    create: {
      method: 'POST',
      path: '',
      contentType: 'multipart/form-data',
      body: addListingImage,
      responses: {201: result},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getListingImageRes},
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {201: result},
    },
  },
  {
    pathPrefix: '/listing-images',
  },
);

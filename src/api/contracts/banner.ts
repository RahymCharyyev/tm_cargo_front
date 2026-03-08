import {initContract} from '@ts-rest/core';
import {addBanner, editBanner, getBannerRes, getBanners, getBannersRes} from '../dto/banner';
import {result} from '../dto/common';
import {z} from 'zod';

const c = initContract();

export const bannerContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getBanners,
      responses: {200: getBannersRes},
      summary: 'get all banners',
    },
  },
  {
    pathPrefix: '/banners',
  },
);

export const adminBannerContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getBanners,
      responses: {200: getBannersRes},
    },
    create: {
      method: 'POST',
      path: '',
      contentType: 'multipart/form-data',
      body: addBanner,
      responses: {201: result},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getBannerRes},
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      contentType: 'multipart/form-data',
      body: editBanner,
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
    pathPrefix: '/banners',
  },
);

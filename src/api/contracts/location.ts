import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {addLocation, editLocation, getLocationRes, getLocations, getLocationsRes} from '../dto/location';
import {result} from '../dto/common';

const c = initContract();

export const locationContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getLocations,
      responses: {200: getLocationsRes},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getLocationRes},
    },
  },
  {
    pathPrefix: '/locations',
  },
);

export const adminLocationContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getLocations,
      responses: {200: getLocationsRes},
    },
    create: {
      method: 'POST',
      path: '',
      contentType: 'multipart/form-data',
      body: addLocation,
      responses: {201: result},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getLocationRes},
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      contentType: 'multipart/form-data',
      pathParams: z.object({id: z.string().uuid()}),
      body: editLocation,
      responses: {201: result},
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {201: result},
    },
    addKeyword: {
      method: 'POST',
      path: '/add/keyword/:id',
      body: z.object({ keyword: z.string()}),
      responses: {201: result},
    },
    removeKeyword: {
      method: 'DELETE',
      path: '/remove/keyword/:id',
      pathParams: z.object({id: z.string().uuid()}),
      body: z.object({keyword: z.string()}),
      responses: {201: result},
    },
  },
  {
    pathPrefix: '/locations',
  },
);

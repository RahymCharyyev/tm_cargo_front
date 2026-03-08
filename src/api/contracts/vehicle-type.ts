import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {
  addVehicleType,
  editVehicleType,
  getVehicleTypeRes,
  getVehicleTypes,
  getVehicleTypesRes,
} from '../dto/vehicle-type';
import {result} from '../dto/common';

const c = initContract();

export const vehicleTypeContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getVehicleTypes,
      responses: {200: getVehicleTypesRes},
      summary: 'get all vehicle types',
    },
  },
  {
    pathPrefix: '/vehicle-types',
  },
);

export const adminVehicleTypeContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getVehicleTypes,
      responses: {200: getVehicleTypesRes},
    },
    create: {
      method: 'POST',
      path: '',
      contentType: 'multipart/form-data',
      body: addVehicleType,
      responses: {201: result},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getVehicleTypeRes},
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      contentType: 'multipart/form-data',
      pathParams: z.object({id: z.string().uuid()}),
      body: editVehicleType,
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
    pathPrefix: '/vehicle-types',
  },
);

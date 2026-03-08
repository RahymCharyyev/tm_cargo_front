import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {result} from '../dto/common';
import {addUser, editUser, getUserRes, getUsers, getUsersRes} from '../dto/user';

const c = initContract();

export const accountContract = c.router(
  {
    remove: {
      method: 'DELETE',
      path: '/',
      responses: {201: result},
    },
  },
  {
    pathPrefix: '/users',
  },
);

export const adminUserContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getUsers,
      responses: {200: getUsersRes},
    },
    create: {
      method: 'POST',
      path: '',
      contentType: 'multipart/form-data',
      body: addUser,
      responses: {201: result},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getUserRes},
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      body: editUser,
      responses: {201: result},
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: result},
    },
  },
  {
    pathPrefix: '/users',
  },
);

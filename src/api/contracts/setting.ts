import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {result} from '../dto/common';
import {editSetting, getSettingRes, getSettings, getSettingsRes} from '../dto/settings';

const c = initContract();

export const settingContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getSettings,
      responses: {200: getSettingsRes},
    },
  },
  {
    pathPrefix: '/settings',
  },
);

export const adminSettingContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getSettings,
      responses: {200: getSettingsRes},
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {200: getSettingRes},
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      body: editSetting,
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
    pathPrefix: '/settings',
  },
);

import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { result } from '../dto/common';
import { addContact, editContact, getContactRes, getContacts, getContactsRes } from '../dto/contact';

const c = initContract();

export const contactContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getContacts,
      responses: { 200: getContactsRes },
      summary: 'get all contacts',
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({ id: z.string().uuid() }),
      responses: { 200: getContactRes },
    },
  },
  {
    pathPrefix: '/contacts',
  },
);

export const adminContactContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: getContacts,
      responses: { 200: getContactsRes },
    },
    create: {
      method: 'POST',
      path: '',
      contentType: 'multipart/form-data',
      body: addContact,
      responses: { 201: result },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({ id: z.string().uuid() }),
      responses: { 200: getContactRes },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: z.object({ id: z.string().uuid() }),
      contentType: 'multipart/form-data',
      body: editContact,
      responses: { 201: result },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({ id: z.string().uuid() }),
      responses: { 201: result },
    },
  },
  {
    pathPrefix: '/contacts',
  },
);

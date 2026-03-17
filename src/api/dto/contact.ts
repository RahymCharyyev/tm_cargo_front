import { z } from 'zod';
import { commonQuery, names, sortDirection } from './common';

const languages = names.pick({ en: true, ru: true, tk: true });
const languagesString = z.string().transform(v => languages.parse(JSON.parse(v)));

export const contactDto = z.object({
  id: z.string().uuid(),
  order: z.coerce.number().int(),
  titles: languages,
  descriptions: languages.nullish(),
  icon: z.string().nullish(),
  createdAt: z.coerce.date(),
});
export type ContactDto = z.infer<typeof contactDto>;

export const sortContactBy = contactDto.pick({ order: true, createdAt: true }).keyof();
const sort = z.object({ sortBy: sortContactBy, sortDirection }).partial();
export type SortContact = z.infer<typeof sort>;

export const getContacts = contactDto
  .pick({ id: true, order: true, icon: true })
  .extend({ title: z.string() })
  .partial()
  .merge(sort)
  .merge(commonQuery);
export type GetContacts = z.infer<typeof getContacts>;

export const getContactsRes = z.object({
  count: z.number(),
  data: contactDto.array(),
});

export const addContact = contactDto
  .pick({ order: true, icon: true })
  .extend({
    titles: languagesString,
    descriptions: languagesString.nullish(),
    icon: z.any()
  });
export type AddContact = z.infer<typeof addContact>;

export const editContact = contactDto
  .pick({ order: true, icon: true })
  .extend({
    titles: languagesString,
    descriptions: languagesString.nullish(),
    icon: z.any()
  })
  .partial();
export type EditContact = z.infer<typeof editContact>;

export const getContactRes = contactDto;

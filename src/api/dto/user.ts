import {z} from 'zod';
import {commonQuery} from './common';

export const userDto = z.object({
  id: z.string().uuid(),
  role: z.enum(['admin', 'member']),
  password: z.string().trim(),
  email: z.string().email().nullable(),
  phone: z
    .union([z.string(), z.number()])
    .transform(v => v.toString())
    .nullable(),
  fullName: z.string().trim().nullable(),
  createdAt: z.coerce.date(),
});

export const getUsers = userDto.omit({password: true}).partial().merge(commonQuery);
export const getUsersRes = z.object({
  count: z.number(),
  data: userDto.array(),
});
export const addUser = userDto.pick({email: true, phone: true, role: true, fullName: true, password: true});
export const editUser = userDto.pick({role: true, fullName: true, password: true}).partial();
export const getUserRes = userDto.omit({password: true}).partial({email: true, phone: true});

export type UserDto = z.infer<typeof userDto>;
export type GetUsers = z.infer<typeof getUsers>;
export type AddUser = z.infer<typeof addUser>;
export type EditUser = z.infer<typeof editUser>;

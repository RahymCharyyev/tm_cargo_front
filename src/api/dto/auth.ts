import {z} from 'zod';
import {userDto} from './user';
import {result} from './common';

export const loginDto = userDto.pick({password: true}).extend({email: userDto.shape.email.unwrap()});
export type LoginDto = z.infer<typeof loginDto>;

export const loginPhoneDto = userDto.pick({password: true}).extend({phone: userDto.shape.phone.unwrap()});
export type LoginPhone = z.infer<typeof loginPhoneDto>;

export const loginUserDto = userDto.pick({
  id: true,
  role: true,
  fullName: true,
  email: true,
  phone: true,
});
export type LoginUserDto = z.infer<typeof loginUserDto>;

export const loginResDto = z.object({
  user: loginUserDto,
  token: z.string(),
});

export const auth = userDto.pick({id: true, role: true});
export type Auth = z.infer<typeof auth>;

export const registerEmailDto = z.object({email: userDto.shape.email.unwrap()});
export type RegisterEmailDto = z.infer<typeof registerEmailDto>;

export const registerPhoneDto = z.object({phone: userDto.shape.phone.unwrap()});
export type RegisterPhoneDto = z.infer<typeof registerPhoneDto>;

export const registerPhoneRes = z.object({phone: z.string()});

export const isPhoneVerified = z.object({phone: userDto.shape.phone.unwrap()});
export type IsPhoneVerified = z.infer<typeof isPhoneVerified>;

export const isPhoneVerifiedRes = z.object({token: z.string()});

export const registerResDto = result.extend({otp: z.string().or(z.number()).optional()});

export const registerVerifyDto = userDto
  .pick({fullName: true, password: true})
  .extend({otp: z.string().trim(), email: userDto.shape.email.unwrap()});
export type RegisterVerifyDto = z.infer<typeof registerVerifyDto>;

export const registerByPhoneDto = userDto
  .pick({fullName: true, password: true})
  .extend({phone: userDto.shape.phone.unwrap()});
export type RegisterByPhoneDto = z.infer<typeof registerByPhoneDto>;

export const meData = userDto.pick({id: true, role: true, fullName: true, email: true, phone: true});

export const resetPasswordDto = z.object({email: userDto.shape.email.unwrap()});
export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;

export const resetPasswordVerifyDto = userDto
  .pick({password: true})
  .extend({otp: z.string().trim(), email: userDto.shape.email.unwrap()});
export type ResetPasswordVerifyDto = z.infer<typeof resetPasswordVerifyDto>;

export const resetPasswordPhoneDto = z.object({phone: userDto.shape.phone.unwrap()});
export type ResetPasswordPhoneDto = z.infer<typeof resetPasswordPhoneDto>;

export const resetPasswordPhoneVerifyDto = userDto.pick({password: true}).extend({phone: userDto.shape.phone.unwrap()});
export type ResetPasswordPhoneVerifyDto = z.infer<typeof resetPasswordPhoneVerifyDto>;

export const verifyPhone = z.object({phone: z.string()});
export type VerifyPhone = z.infer<typeof verifyPhone>;

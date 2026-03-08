import {z} from 'zod';

export const otpDto = z.object({
  key: z.string().trim(),
  type: z.enum(['auth', 'listingPhone', 'resetPhone']),
  value: z.string().trim(),
  attempt: z.coerce.number().int(),
});
export type OtpDto = z.infer<typeof otpDto>;

export const verifyDto = otpDto.pick({key: true, value: true});
export type VerifyDto = z.infer<typeof verifyDto>;

export const setDto = otpDto.pick({key: true, value: true, type: true});
export type SetDto = z.infer<typeof setDto>;

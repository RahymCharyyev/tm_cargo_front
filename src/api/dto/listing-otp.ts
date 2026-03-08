import {z} from 'zod';

export const listingVerifyPhoneDto = z.object({
  phone: z.string().trim(),
});
export type ListingVerifyPhone = z.infer<typeof listingVerifyPhoneDto>;

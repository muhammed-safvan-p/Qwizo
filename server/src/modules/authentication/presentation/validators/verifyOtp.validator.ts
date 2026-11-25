import { z } from 'zod';

export const verifyOtpSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),

  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must contain only numbers'),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

import type { User } from '../../domain/entities/User.js';

export interface InitiateVerifyOtpInput {
  email: string;
  otp: string;
}

export interface IntiateVerifyOtpOutput {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

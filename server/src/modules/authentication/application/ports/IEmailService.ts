export interface IEmailService {
  sendRegistrationOtp(to: string, name: string, otp: string): Promise<void>;
  sendPasswordResetLink(to: string, name: string, resetLink: string): Promise<void>;
}


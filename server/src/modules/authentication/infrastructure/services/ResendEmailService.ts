import { Resend } from 'resend';
import type { IEmailService } from '../../application/ports/IEmailService.js';

export class ResendEmailService implements IEmailService {
  private resend: Resend | null = null;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'Qwizo <onboarding@resend.dev>';
  }

  async sendRegistrationOtp(to: string, name: string, otp: string): Promise<void> {
    if (!this.resend) {
      console.log(`\n======================================================`);
      console.log(`[DEV EMAIL SERVICE] 📨 Staged Registration OTP for ${name} <${to}>`);
      console.log(`OTP Code: [ ${otp} ] (Valid for 10 minutes)`);
      console.log(`======================================================\n`);
      return;
    }

    await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: 'Verify Your Qwizo Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Qwizo, ${name}!</h2>
          <p>Please enter the following 6-digit verification code to complete your registration:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetLink(_to: string, _name: string, _resetLink: string): Promise<void> {
    // For password reset flow in Phase 12
  }
}

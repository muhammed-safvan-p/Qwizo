import crypto from 'node:crypto';
import type { IOTPHasher } from '../../application/ports/IOTPHasher.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class CryptoOtpHasher implements IOTPHasher {
  constructor(private readonly secret: string = process.env.OTP_SECRET ?? '') {
    if (!this.secret) {
      throw AppError.internal('OTP_SECRET environment variable is required');
    }
  }

  hash(otp: string): string {
    return crypto.createHmac('sha256', this.secret).update(otp).digest('hex');
  }

  compare(otp: string, hash: string): boolean {
    const computed = this.hash(otp);
    if (computed.length !== hash.length) return false;
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  }
}

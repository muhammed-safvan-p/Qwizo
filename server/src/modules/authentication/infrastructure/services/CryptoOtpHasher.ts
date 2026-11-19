import crypto from "node:crypto";
import type { IOTPHasher } from "../../application/ports/IOTPHasher.js";

export class CryptoOtpHasher implements IOTPHasher {
  private readonly secret: string;

  constructor(secret = process.env.OTP_SECRET || "qwizo-otp-dev-secret-key-12345") {
    this.secret = secret;
  }

  hash(otp: string): string {
    return crypto.createHmac("sha256", this.secret).update(otp).digest("hex");
  }

  compare(otp: string, hash: string): boolean {
    const computed = this.hash(otp);
    if (computed.length !== hash.length) return false;
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  }
}


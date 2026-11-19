import crypto from "node:crypto";
import type { IOTPGenerator } from "../../application/ports/IOTPGenerator.js";

export class CryptoOtpGenerator implements IOTPGenerator {
  generate(length = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max + 1).toString();
  }
}


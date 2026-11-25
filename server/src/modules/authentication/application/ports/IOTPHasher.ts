export interface IOTPHasher {
  hash(otp: string): string;
  compare(otp: string, hash: string): boolean;
}

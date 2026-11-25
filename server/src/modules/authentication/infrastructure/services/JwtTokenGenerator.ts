import jwt, { type SignOptions } from 'jsonwebtoken';
import type { IJwtTokenGenerator, JwtPayload } from '../../application/ports/IJwtTokenGenerator.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class JwtTokenGenerator implements IJwtTokenGenerator {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    this.accessSecret =
      process.env.JWT_ACCESS_SECRET || 'default_access_secret_change_in_production';
    this.refreshSecret =
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_in_production';
    this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: SignOptions = {
        expiresIn: this.accessExpiresIn as unknown as number, // jsonwebtoken accepts string formats like '15m'
      };

      jwt.sign(payload, this.accessSecret, options, (err, token) => {
        if (err || !token) {
          return reject(AppError.internal('Failed to generate access token'));
        }
        resolve(token);
      });
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: SignOptions = {
        expiresIn: this.refreshExpiresIn as unknown as number, // jsonwebtoken accepts string formats like '7d'
      };

      jwt.sign(payload, this.refreshSecret, options, (err, token) => {
        if (err || !token) {
          return reject(AppError.internal('Failed to generate refresh token'));
        }
        resolve(token);
      });
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.accessSecret, (err, decoded) => {
        if (err || !decoded) {
          return reject(AppError.unauthorized('Invalid or expired access token'));
        }
        resolve(decoded as JwtPayload);
      });
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.refreshSecret, (err, decoded) => {
        if (err || !decoded) {
          return reject(AppError.unauthorized('Invalid or expired refresh token'));
        }
        resolve(decoded as JwtPayload);
      });
    });
  }
}

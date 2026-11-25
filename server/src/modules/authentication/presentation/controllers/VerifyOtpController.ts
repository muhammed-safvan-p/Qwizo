import type { Request, Response, NextFunction } from 'express';
import type { IInitiateVerifyOtpUseCase } from '../../application/ports/IInitiateVerifyOtpUseCase.js';
import { verifyOtpSchema } from '../validators/verifyOtp.validator.js';

export class VerifyOtpController {
  constructor(private readonly initiateVerifyOtpUseCase: IInitiateVerifyOtpUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = verifyOtpSchema.parse(req.body);

      const result = await this.initiateVerifyOtpUseCase.execute(validated);

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

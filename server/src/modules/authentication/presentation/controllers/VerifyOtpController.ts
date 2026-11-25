import type { Request, Response, NextFunction } from 'express';
import type { IInitiateVerifyOtpUseCase } from '../../application/ports/IInitiateVerifyOtpUseCase.js';
import { verifyOtpSchema } from '../validators/verifyOtp.validator.js';
import { ApiResponse } from '../../../../shared/presentation/utils/ApiResponse.js';

export class VerifyOtpController {
  constructor(private readonly initiateVerifyOtpUseCase: IInitiateVerifyOtpUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = verifyOtpSchema.parse(req.body);

      const result = await this.initiateVerifyOtpUseCase.execute(validated);

      ApiResponse.created(
        res,
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        },
        result.message,
      );
    } catch (error) {
      next(error);
    }
  }
}

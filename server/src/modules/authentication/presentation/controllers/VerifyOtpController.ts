import type { Request, Response, NextFunction } from 'express';
import type { IInitiateVerifyOtpUseCase } from '../../application/ports/IInitiateVerifyOtpUseCase.js';
import { verifyOtpSchema } from '../validators/verifyOtp.validator.js';
import { ApiResponse } from '../../../../shared/presentation/utils/ApiResponse.js';
import { UserMapper } from '../mappers/UserMapper.js';

export class VerifyOtpController {
  constructor(private readonly initiateVerifyOtpUseCase: IInitiateVerifyOtpUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = verifyOtpSchema.parse(req.body);

      const result = await this.initiateVerifyOtpUseCase.execute(validated);

      res.cookie('refresh-token', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      ApiResponse.created(
        res,
        {
          accessToken: result.accessToken,
          user: UserMapper.toResponse(result.user),
        },
        result.message,
      );
    } catch (error) {
      next(error);
    }
  };
}

import type { Request, Response, NextFunction } from 'express';
import type { LoginUseCase } from '../../application/use-cases/LoginUseCase.js';

import { loginSchema } from '../validators/login.validator.js';
import { ApiResponse } from '../../../../shared/presentation/utils/ApiResponse.js';
import { UserMapper } from '../mappers/UserMapper.js';

export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = loginSchema.parse(req.body);

      const result = await this.loginUseCase.execute(validated);

      res.cookie('refresh-token', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      ApiResponse.ok(
        res,
        {
          user: UserMapper.toResponse(result.user),
          accessToken: result.accessToken,
        },
        result.message,
      );
    } catch (error) {
      next(error);
    }
  };
}

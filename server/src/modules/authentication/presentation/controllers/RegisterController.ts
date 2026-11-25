import type { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../validators/register.validator.js';
import type { IInitiateRegistrationUseCase } from '../../application/ports/IInitiateRegistrationUseCase.js';
import { ApiResponse } from '../../../../shared/presentation/utils/ApiResponse.js';

export class RegisterController {
  constructor(private readonly initiateRegistrationUseCase: IInitiateRegistrationUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);

      const result = await this.initiateRegistrationUseCase.execute({
        fullName: validated.fullName,
        email: validated.email,
        password: validated.password,
      });

      ApiResponse.created(
        res,
        {
          email: result.email,
          expiresInSeconds: result.expiresInSeconds,
        },
        result.message,
      );
    } catch (error) {
      next(error);
    }
  }
}

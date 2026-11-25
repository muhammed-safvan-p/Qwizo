import type { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../validators/register.validator.js';
import type { IInitiateRegistrationUseCase } from '../../application/ports/IInitiateRegistrationUseCase.js';

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

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          email: result.email,
          expiresInSeconds: result.expiresInSeconds,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

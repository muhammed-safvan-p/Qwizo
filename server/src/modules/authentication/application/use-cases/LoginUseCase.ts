import { User } from '../../domain/entities/User.js';

import type { IUserRepository } from '../ports/IUserRepository.js';
import type { IPasswordHasher } from '../../application/ports/IPasswordHasher.js';
import type { IJwtTokenGenerator } from '../ports/IJwtTokenGenerator.js';
import type { LoginInputDto, LoginOutputDto } from '../dtos/LoginInputDto.js';

import { AppError } from '../../../../shared/errors/AppError.js';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwtTokenGenerator: IJwtTokenGenerator,
  ) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    if (!user.passwordHash) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const isMatch = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const accessToken = await this.jwtTokenGenerator.generateAccessToken({ userId: user.id });
    const refreshToken = await this.jwtTokenGenerator.generateRefreshToken({ userId: user.id });

    return {
      user,
      accessToken,
      refreshToken,
      message: 'Login successfull',
    };
  }
}

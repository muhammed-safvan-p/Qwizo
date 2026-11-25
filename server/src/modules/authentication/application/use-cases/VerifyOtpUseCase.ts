import { User } from '../../domain/entities/User.js';

import type { IPendingRegistrationRepository } from '../ports/IPendingRegistrationRepository.js';
import type { IUserRepository } from '../ports/IUserRepository.js';
import type { IOTPHasher } from '../ports/IOTPHasher.js';
import type { IIdGenerator } from '../ports/IIdGenerator.js';
import type { IJwtTokenGenerator } from '../ports/IJwtTokenGenerator.js';
import type {
  InitiateVerifyOtpInput,
  IntiateVerifyOtpOutput,
} from '../dtos/InitiateVerifyOtpDto.js';

import { AppError } from '../../../../shared/errors/AppError.js';

export class VerifyOtpUseCase {
  constructor(
    private readonly pendingRegistrationRepo: IPendingRegistrationRepository,
    private readonly otpHasher: IOTPHasher,
    private readonly idGenerator: IIdGenerator,
    private readonly userRepository: IUserRepository,
    private readonly jwtTokenGenerator: IJwtTokenGenerator,
  ) {}

  async execute(input: InitiateVerifyOtpInput): Promise<IntiateVerifyOtpOutput> {
    const email = input.email.toLowerCase().trim();
    const otp = input.otp.trim();

    const pendingReg = await this.pendingRegistrationRepo.findByEmail(email);
    if (!pendingReg) {
      throw AppError.notFound('Registration is not found');
    }

    if (pendingReg.isOtpExpired()) {
      await this.pendingRegistrationRepo.deleteByEmail(email);
      throw AppError.badRequest('OTP has been expired');
    }

    if (pendingReg.isMaxAttemptsExceeded()) {
      await this.pendingRegistrationRepo.deleteByEmail(email);
      throw AppError.badRequest('Max attempts reached');
    }

    const isOtpValid = this.otpHasher.compare(otp, pendingReg.otpHash);
    if (!isOtpValid) {
      pendingReg.incrementAttempts();
      throw AppError.unauthorized('Invalid Otp');
    }

    // valid
    const user = User.createNew({
      id: this.idGenerator.generate(),
      name: pendingReg.name,
      email: pendingReg.email,
      passwordHash: pendingReg.passwordHash,
      role: 'USER',
      authProvider: 'local',
    });
    await this.userRepository.save(user);
    await this.pendingRegistrationRepo.deleteByEmail(email);

    const accessToken = await this.jwtTokenGenerator.generateAccessToken({
      userId: user.id,
    });

    const refreshToken = await this.jwtTokenGenerator.generateRefreshToken({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
      user,
      message: 'Account Verified Successfully',
    };
  }
}

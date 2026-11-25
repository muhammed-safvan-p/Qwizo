import { AppError } from '../../../../shared/errors/AppError.js';
import { PendingRegistration } from '../../domain/entities/PendingRegistration.js';
import type { IUserRepository } from '../ports/IUserRepository.js';
import type { IPendingRegistrationRepository } from '../ports/IPendingRegistrationRepository.js';
import type { IPasswordHasher } from '../ports/IPasswordHasher.js';
import type { IOTPGenerator } from '../ports/IOTPGenerator.js';
import type { IOTPHasher } from '../ports/IOTPHasher.js';
import type { IEmailService } from '../ports/IEmailService.js';
import type { IIdGenerator } from '../ports/IIdGenerator.js';
import type { IInitiateRegistrationUseCase } from '../ports/IInitiateRegistrationUseCase.js';
import type {
  InitiateRegistrationInput,
  InitiateRegistrationOutput,
} from '../dtos/InitiateRegistrationDto.js';

export class InitiateRegistrationUseCase implements IInitiateRegistrationUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly pendingRegistrationRepo: IPendingRegistrationRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpGenerator: IOTPGenerator,
    private readonly otpHasher: IOTPHasher,
    private readonly emailService: IEmailService,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(input: InitiateRegistrationInput): Promise<InitiateRegistrationOutput> {
    const email = input.email.toLowerCase().trim();
    const fullName = input.fullName.trim();

    const userExists = await this.userRepo.findByEmail(email);
    if (userExists) {
      throw AppError.conflict('A user with this email already exists');
    }

    const existingPending = await this.pendingRegistrationRepo.findByEmail(email);
    if (existingPending) {
      if (!existingPending.canResendOtp(60)) {
        const remaining = existingPending.getResendCooldownSecondsRemaining(60);
        throw new AppError(
          `Please wait ${remaining}s before requesting a new verification code`,
          429,
          'OTP_RESEND_COOLDOWN',
        );
      }

      // Hash password
      const passwordHash = await this.passwordHasher.hash(input.password);
      const otp = this.otpGenerator.generate(6);
      const otpHash = this.otpHasher.hash(otp);
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      existingPending.updateOtp(otpHash, otpExpiresAt);
      await this.pendingRegistrationRepo.update(existingPending);

      // email
      await this.emailService.sendRegistrationOtp(email, fullName, otp);

      return {
        email,
        message: 'Verification code sent to your email',
        expiresInSeconds: 600,
      };
    }

    //new registration
    const passwordHash = await this.passwordHasher.hash(input.password);
    const otp = this.otpGenerator.generate(6);
    const otpHash = this.otpHasher.hash(otp);
    const now = new Date();
    const otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const pendingRegistration = PendingRegistration.createNew({
      id: this.idGenerator.generate(),
      name: fullName,
      email,
      passwordHash,
      otpHash,
      otpExpiresAt,
      expiresAt,
    });

    await this.pendingRegistrationRepo.save(pendingRegistration);

    await this.emailService.sendRegistrationOtp(email, fullName, otp);

    return {
      email,
      message: 'Verification code sent to your email',
      expiresInSeconds: 600,
    };
  }
}

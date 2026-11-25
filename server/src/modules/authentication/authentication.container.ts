import { MongoUserRepository } from './infrastructure/repositories/MongoUserRepository.js';
import { MongoPendingRegistrationRepository } from './infrastructure/repositories/MongoPendingRegistrationRepository.js';
import { Argon2PasswordHasher } from './infrastructure/services/Argon2PasswordHasher.js';
import { CryptoOtpGenerator } from './infrastructure/services/CryptoOtpGenerator.js';
import { CryptoOtpHasher } from './infrastructure/services/CryptoOtpHasher.js';
import { ResendEmailService } from './infrastructure/services/ResendEmailService.js';
import { UuidGenerator } from './infrastructure/services/UuidGenerator.js';
import { JwtTokenGenerator } from './infrastructure/services/JwtTokenGenerator.js';

import { InitiateRegistrationUseCase } from './application/use-cases/InitiateRegistrationUseCase.js';
import { VerifyOtpUseCase } from './application/use-cases/VerifyOtpUseCase.js';
import { LoginUseCase } from './application/use-cases/LoginUseCase.js';

import { RegisterController } from './presentation/controllers/RegisterController.js';
import { VerifyOtpController } from './presentation/controllers/VerifyOtpController.js';
import { LoginController } from './presentation/controllers/LoginController.js';

// adapters & services
const userRepo = new MongoUserRepository();
const pendingRegistrationRepo = new MongoPendingRegistrationRepository();
const passwordHasher = new Argon2PasswordHasher();
const otpGenerator = new CryptoOtpGenerator();
const otpHasher = new CryptoOtpHasher();
const emailService = new ResendEmailService();
const idGenerator = new UuidGenerator();
const jwtTokenGenerator = new JwtTokenGenerator();

//use cases
const initiateRegistrationUseCase = new InitiateRegistrationUseCase(
  userRepo,
  pendingRegistrationRepo,
  passwordHasher,
  otpGenerator,
  otpHasher,
  emailService,
  idGenerator,
);

const verifyOtpUseCase = new VerifyOtpUseCase(
  pendingRegistrationRepo,
  otpHasher,
  idGenerator,
  userRepo,
  jwtTokenGenerator,
);

const loginUseCase = new LoginUseCase(userRepo, passwordHasher, jwtTokenGenerator);

// controllers
export const registerController = new RegisterController(initiateRegistrationUseCase);
export const verifyOtpController = new VerifyOtpController(verifyOtpUseCase);
export const loginController = new LoginController(loginUseCase);

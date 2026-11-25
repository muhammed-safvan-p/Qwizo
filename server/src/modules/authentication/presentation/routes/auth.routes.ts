import { Router } from 'express';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository.js';
import { MongoPendingRegistrationRepository } from '../../infrastructure/repositories/MongoPendingRegistrationRepository.js';
import { Argon2PasswordHasher } from '../../infrastructure/services/Argon2PasswordHasher.js';
import { CryptoOtpGenerator } from '../../infrastructure/services/CryptoOtpGenerator.js';
import { CryptoOtpHasher } from '../../infrastructure/services/CryptoOtpHasher.js';
import { ResendEmailService } from '../../infrastructure/services/ResendEmailService.js';
import { UuidGenerator } from '../../infrastructure/services/UuidGenerator.js';
import { JwtTokenGenerator } from '../../infrastructure/services/JwtTokenGenerator.js';
import { InitiateRegistrationUseCase } from '../../application/use-cases/InitiateRegistrationUseCase.js';
import { VerifyOtpUseCase } from '../../application/use-cases/VerifyOtpUseCase.js';
import { RegisterController } from '../controllers/RegisterController.js';
import { VerifyOtpController } from '../controllers/VerifyOtpController.js';

const authRouter: Router = Router();

const userRepo = new MongoUserRepository();
const pendingRegistrationRepo = new MongoPendingRegistrationRepository();
const passwordHasher = new Argon2PasswordHasher();
const otpGenerator = new CryptoOtpGenerator();
const otpHasher = new CryptoOtpHasher();
const emailService = new ResendEmailService();
const idGenerator = new UuidGenerator();
const jwtTokenGenerator = new JwtTokenGenerator();

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

const registerController = new RegisterController(initiateRegistrationUseCase);
const verifyOtpController = new VerifyOtpController(verifyOtpUseCase);

authRouter.post('/register', (req, res, next) => {
  registerController.handle(req, res, next);
});

authRouter.post('/verify-otp', (req, res, next) => {
  verifyOtpController.handle(req, res, next);
});

export default authRouter;

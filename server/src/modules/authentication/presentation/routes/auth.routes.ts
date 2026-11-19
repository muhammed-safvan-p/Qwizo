import { Router } from "express";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository.js";
import { MongoPendingRegistrationRepository } from "../../infrastructure/repositories/MongoPendingRegistrationRepository.js";
import { Argon2PasswordHasher } from "../../infrastructure/services/Argon2PasswordHasher.js";
import { CryptoOtpGenerator } from "../../infrastructure/services/CryptoOtpGenerator.js";
import { CryptoOtpHasher } from "../../infrastructure/services/CryptoOtpHasher.js";
import { ResendEmailService } from "../../infrastructure/services/ResendEmailService.js";
import { UuidGenerator } from "../../infrastructure/services/UuidGenerator.js";
import { InitiateRegistrationUseCase } from "../../application/use-cases/InitiateRegistrationUseCase.js";
import { RegisterController } from "../controllers/RegisterController.js";

const authRouter: Router = Router();

const userRepo = new MongoUserRepository();
const pendingRegistrationRepo = new MongoPendingRegistrationRepository();
const passwordHasher = new Argon2PasswordHasher();
const otpGenerator = new CryptoOtpGenerator();
const otpHasher = new CryptoOtpHasher();
const emailService = new ResendEmailService();
const idGenerator = new UuidGenerator();

const initiateRegistrationUseCase = new InitiateRegistrationUseCase(
  userRepo,
  pendingRegistrationRepo,
  passwordHasher,
  otpGenerator,
  otpHasher,
  emailService,
  idGenerator
);

const registerController = new RegisterController(initiateRegistrationUseCase);

authRouter.post("/register", (req, res, next) => {
  registerController.handle(req, res, next);
});


export default authRouter;


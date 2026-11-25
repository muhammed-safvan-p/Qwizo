import { Router } from 'express';
import {
  registerController,
  verifyOtpController,
  loginController,
} from '../../authentication.container.js';

const authRouter: Router = Router();

authRouter.post('/register', registerController.handle);
authRouter.post('/verify-otp', verifyOtpController.handle);
authRouter.post('/login', loginController.handle);

export default authRouter;

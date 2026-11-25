import type { IUseCase } from '../../../../shared/application/IUseCase.js';
import type {
  InitiateVerifyOtpInput,
  IntiateVerifyOtpOutput,
} from '../dtos/InitiateVerifyOtpDto.js';

export type IInitiateVerifyOtpUseCase = IUseCase<InitiateVerifyOtpInput, IntiateVerifyOtpOutput>;

import type { IUseCase } from '../../../../shared/application/IUseCase.js';
import type {
  InitiateRegistrationInput,
  InitiateRegistrationOutput,
} from '../dtos/InitiateRegistrationDto.js';

export type IInitiateRegistrationUseCase = IUseCase<
  InitiateRegistrationInput,
  InitiateRegistrationOutput
>;

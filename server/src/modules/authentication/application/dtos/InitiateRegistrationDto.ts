export interface InitiateRegistrationInput {
  email: string;
  password: string;
  fullName: string;
}

export interface InitiateRegistrationOutput {
  email: string;
  message: string;
  expiresInSeconds: number;
}


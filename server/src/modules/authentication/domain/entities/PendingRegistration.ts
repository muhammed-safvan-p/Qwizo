export interface PendingRegistrationProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  otpHash: string;
  otpExpiresAt: Date;
  otpAttempts: number;
  resendCount: number;
  lastOtpSentAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class PendingRegistration {
  private constructor(private readonly props: PendingRegistrationProps) {}

  static create(props: PendingRegistrationProps): PendingRegistration {
    return new PendingRegistration(props);
  }

  static createNew(params: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    otpHash: string;
    otpExpiresAt: Date;
    expiresAt: Date;
  }): PendingRegistration {
    const now = new Date();
    return new PendingRegistration({
      id: params.id,
      name: params.name,
      email: params.email.toLowerCase().trim(),
      passwordHash: params.passwordHash,
      otpHash: params.otpHash,
      otpExpiresAt: params.otpExpiresAt,
      otpAttempts: 0,
      resendCount: 0,
      lastOtpSentAt: now,
      expiresAt: params.expiresAt,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get otpHash(): string { return this.props.otpHash; }
  get otpExpiresAt(): Date { return this.props.otpExpiresAt; }
  get otpAttempts(): number { return this.props.otpAttempts; }
  get resendCount(): number { return this.props.resendCount; }
  get lastOtpSentAt(): Date { return this.props.lastOtpSentAt; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isOtpExpired(): boolean {
    return new Date() > this.props.otpExpiresAt;
  }
}
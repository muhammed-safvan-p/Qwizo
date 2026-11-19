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

  public static create(props: PendingRegistrationProps): PendingRegistration {
    return new PendingRegistration(props);
  }

  public static createNew(params: {
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

  public isOtpExpired(): boolean {
    return new Date() > this.props.otpExpiresAt;
  }

  public isRegistrationExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  public isMaxAttemptsExceeded(maxAttempts = 5): boolean {
    return this.props.otpAttempts >= maxAttempts;
  }

  public incrementAttempts(): void {
    this.props.otpAttempts += 1;
    this.props.updatedAt = new Date();
  }

  public getResendCooldownSecondsRemaining(cooldownSeconds = 60): number {
    const elapsedSeconds = Math.floor((Date.now() - this.props.lastOtpSentAt.getTime()) / 1000);
    const remaining = cooldownSeconds - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  }

  public canResendOtp(cooldownSeconds = 60): boolean {
    return this.getResendCooldownSecondsRemaining(cooldownSeconds) === 0;
  }

  public updateOtp(newOtpHash: string, newOtpExpiresAt: Date): void {
    const now = new Date();
    this.props.otpHash = newOtpHash;
    this.props.otpExpiresAt = newOtpExpiresAt;
    this.props.otpAttempts = 0;
    this.props.resendCount += 1;
    this.props.lastOtpSentAt = now;
    this.props.updatedAt = now;
  }
}
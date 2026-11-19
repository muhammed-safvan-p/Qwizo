export interface PasswordResetProps {
  id: string;
  userId: string;
  email: string;
  tokenHash: string;
  isConsumed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class PasswordReset {
  private constructor(private readonly props: PasswordResetProps) {}

  public static create(props: PasswordResetProps): PasswordReset {
    return new PasswordReset(props);
  }

  public static createNew(params: {
    id: string;
    userId: string;
    email: string;
    tokenHash: string;
    expiresAt: Date;
  }): PasswordReset {
    const now = new Date();
    return new PasswordReset({
      id: params.id,
      userId: params.userId,
      email: params.email.toLowerCase().trim(),
      tokenHash: params.tokenHash,
      isConsumed: false,
      expiresAt: params.expiresAt,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get email(): string { return this.props.email; }
  get tokenHash(): string { return this.props.tokenHash; }
  get isConsumed(): boolean { return this.props.isConsumed; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  public isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  public isValid(): boolean {
    return !this.props.isConsumed && !this.isExpired();
  }

  public consume(): void {
    this.props.isConsumed = true;
    this.props.updatedAt = new Date();
  }
}
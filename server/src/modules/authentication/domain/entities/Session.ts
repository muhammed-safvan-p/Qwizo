export interface SessionProps {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  private constructor(private readonly props: SessionProps) {}

  public static create(props: SessionProps): Session {
    return new Session(props);
  }

  public static createNew(params: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent?: string | null;
    ipAddress?: string | null;
  }): Session {
    const now = new Date();
    return new Session({
      id: params.id,
      userId: params.userId,
      refreshTokenHash: params.refreshTokenHash,
      userAgent: params.userAgent ?? null,
      ipAddress: params.ipAddress ?? null,
      isRevoked: false,
      expiresAt: params.expiresAt,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get refreshTokenHash(): string { return this.props.refreshTokenHash; }
  get userAgent(): string | null | undefined { return this.props.userAgent; }
  get ipAddress(): string | null | undefined { return this.props.ipAddress; }
  get isRevoked(): boolean { return this.props.isRevoked; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  public isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  public isValid(): boolean {
    return !this.props.isRevoked && !this.isExpired();
  }

  public revoke(): void {
    this.props.isRevoked = true;
    this.props.updatedAt = new Date();
  }

  public rotate(newRefreshTokenHash: string, newExpiresAt: Date): void {
    this.props.refreshTokenHash = newRefreshTokenHash;
    this.props.expiresAt = newExpiresAt;
    this.props.updatedAt = new Date();
  }
}
import type { UserRole } from "../types/UserRole.js";

export interface UserCredits {
  balance: number;
  reserved: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt: Date | null;
  isSuspended: boolean;
  authProvider: "local" | "google";
  credits: UserCredits;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(props: UserProps): User {
    return new User(props);
  }

  public static createNew(params: {
    id: string;
    name: string;
    email: string;
    passwordHash: string | null;
    role?: UserRole;
    authProvider?: "local" | "google";
  }): User {
    const now = new Date();
    return new User({
      id: params.id,
      name: params.name,
      email: params.email.toLowerCase().trim(),
      passwordHash: params.passwordHash,
      role: params.role ?? "USER",
      avatarUrl: null,
      isEmailVerified: true,
      emailVerifiedAt: now,
      isSuspended: false,
      authProvider: params.authProvider ?? "local",
      credits: { balance: 0, reserved: 0, lifetimeEarned: 0, lifetimeSpent: 0 },
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
  get passwordHash(): string | null { return this.props.passwordHash; }
  get role(): UserRole { return this.props.role; }
  get avatarUrl(): string | null | undefined { return this.props.avatarUrl; }
  get isEmailVerified(): boolean { return this.props.isEmailVerified; }
  get emailVerifiedAt(): Date | null { return this.props.emailVerifiedAt; }
  get isSuspended(): boolean { return this.props.isSuspended; }
  get authProvider(): "local" | "google" { return this.props.authProvider; }
  get credits(): UserCredits { return this.props.credits; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  public updatePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.props.updatedAt = new Date();
  }

  public suspend(): void {
    this.props.isSuspended = true;
    this.props.updatedAt = new Date();
  }

  public reactivate(): void {
    this.props.isSuspended = false;
    this.props.updatedAt = new Date();
  }
}
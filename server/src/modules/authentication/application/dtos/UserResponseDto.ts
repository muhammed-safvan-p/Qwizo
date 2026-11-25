import type { UserRole } from '../../domain/types/UserRole.js';
import type { UserCredits } from '../../domain/entities/User.js';

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  credits: UserCredits;
  createdAt: string;
  updatedAt: string;
}

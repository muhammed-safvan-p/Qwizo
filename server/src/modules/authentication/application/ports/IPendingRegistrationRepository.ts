import type { PendingRegistration } from '../../domain/entities/PendingRegistration.js';

export interface IPendingRegistrationRepository {
  findById(id: string): Promise<PendingRegistration | null>;
  findByEmail(email: string): Promise<PendingRegistration | null>;
  save(pendingRegistration: PendingRegistration): Promise<void>;
  update(pendingRegistration: PendingRegistration): Promise<void>;
  deleteByEmail(email: string): Promise<void>;
}

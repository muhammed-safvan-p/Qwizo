import type { IPendingRegistrationRepository } from "../../application/ports/IPendingRegistrationRepository.js";
import { PendingRegistration } from "../../domain/entities/PendingRegistration.js";
import { type IPendingRegistrationDoc, PendingRegistrationModel } from "../models/PendingRegistration.model.js";

export class MongoPendingRegistrationRepository implements IPendingRegistrationRepository {
  async findById(id: string): Promise<PendingRegistration | null> {
    const doc = await PendingRegistrationModel.findById(id).lean<IPendingRegistrationDoc>();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<PendingRegistration | null> {
    const doc = await PendingRegistrationModel.findOne({ email: email.toLowerCase().trim() }).lean<IPendingRegistrationDoc>();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async save(pendingRegistration: PendingRegistration): Promise<void> {
    await PendingRegistrationModel.create({
      _id: pendingRegistration.id,
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
      otpHash: pendingRegistration.otpHash,
      otpExpiresAt: pendingRegistration.otpExpiresAt,
      otpAttempts: pendingRegistration.otpAttempts,
      resendCount: pendingRegistration.resendCount,
      lastOtpSentAt: pendingRegistration.lastOtpSentAt,
      expiresAt: pendingRegistration.expiresAt,
    });
  }

  async update(pendingRegistration: PendingRegistration): Promise<void> {
    await PendingRegistrationModel.updateOne(
      { email: pendingRegistration.email },
      {
        $set: {
          name: pendingRegistration.name,
          passwordHash: pendingRegistration.passwordHash,
          otpHash: pendingRegistration.otpHash,
          otpExpiresAt: pendingRegistration.otpExpiresAt,
          otpAttempts: pendingRegistration.otpAttempts,
          resendCount: pendingRegistration.resendCount,
          lastOtpSentAt: pendingRegistration.lastOtpSentAt,
          expiresAt: pendingRegistration.expiresAt,
          updatedAt: new Date(),
        },
      }
    );
  }

  async deleteByEmail(email: string): Promise<void> {
    await PendingRegistrationModel.deleteOne({ email: email.toLowerCase().trim() });
  }

  private toEntity(doc: IPendingRegistrationDoc): PendingRegistration {
    return PendingRegistration.create({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      otpHash: doc.otpHash,
      otpExpiresAt: doc.otpExpiresAt,
      otpAttempts: doc.otpAttempts,
      resendCount: doc.resendCount,
      lastOtpSentAt: doc.lastOtpSentAt,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt ?? new Date(),
      updatedAt: doc.updatedAt ?? new Date(),
    });
  }
}


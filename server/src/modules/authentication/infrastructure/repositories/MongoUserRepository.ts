import type { IUserRepository } from "../../application/ports/IUserRepository.js";
import { User } from "../../domain/entities/User.js";
import { type IUserDoc, UserModel } from "../models/User.model.js";

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean<IUserDoc>();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean<IUserDoc>();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase().trim() });
    return count > 0;
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      isSuspended: user.isSuspended,
      authProvider: user.authProvider,
      credits: user.credits,
    });
  }

  async update(user: User): Promise<void> {
    await UserModel.updateOne(
      { _id: user.id },
      {
        $set: {
          name: user.name,
          passwordHash: user.passwordHash,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isEmailVerified: user.isEmailVerified,
          emailVerifiedAt: user.emailVerifiedAt,
          isSuspended: user.isSuspended,
          credits: user.credits,
          updatedAt: new Date(),
        },
      }
    );
  }

  private toEntity(doc: IUserDoc): User {
    return User.create({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      avatarUrl: doc.avatarUrl,
      isEmailVerified: doc.isEmailVerified,
      emailVerifiedAt: doc.emailVerifiedAt ?? null,
      isSuspended: doc.isSuspended,
      authProvider: doc.authProvider,
      credits: doc.credits,
      createdAt: doc.createdAt ?? new Date(),
      updatedAt: doc.updatedAt ?? new Date(),
    });
  }
}


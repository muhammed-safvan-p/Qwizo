import mongoose, { Schema, type Model } from 'mongoose';

export interface IUserDoc {
  _id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;
  isSuspended: boolean;
  authProvider: 'local' | 'google';
  credits: {
    balance: number;
    reserved: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUserDoc>(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    credits: {
      balance: { type: Number, default: 0 },
      reserved: { type: Number, default: 0 },
      lifetimeEarned: { type: Number, default: 0 },
      lifetimeSpent: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

export const UserModel: Model<IUserDoc> =
  mongoose.models.User || mongoose.model<IUserDoc>('User', userSchema);

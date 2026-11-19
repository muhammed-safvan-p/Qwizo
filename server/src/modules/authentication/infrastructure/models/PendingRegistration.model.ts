import mongoose, { Schema, type Model } from "mongoose";

export interface IPendingRegistrationDoc {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  otpHash: string;
  otpExpiresAt: Date;
  otpAttempts: number;
  resendCount: number;
  lastOtpSentAt: Date;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const pendingRegistrationSchema = new Schema<IPendingRegistrationDoc>(
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
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    resendCount: {
      type: Number,
      default: 0,
    },
    lastOtpSentAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "pendingRegistrations",
  }
);

// TTL index: automatically deletes expired pending registrations
pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingRegistrationModel: Model<IPendingRegistrationDoc> =
  mongoose.models.PendingRegistration ||
  mongoose.model<IPendingRegistrationDoc>(
    "PendingRegistration",
    pendingRegistrationSchema
  );

import { model, Schema } from "mongoose";

const RefreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // TODO check uniqueness works
    unique: true,
  },
  createdAt: {
    required: true,
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    required: true,
    type: Number,
  },
  refreshToken: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  refreshAttemptsUsed: {
    type: Number,
    required: true,
  },
});

export const RefreshToken = model("RefreshToken", RefreshTokenSchema);
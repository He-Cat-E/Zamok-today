import mongoose from "mongoose";
import { PRIMARY_WALLET_CURRENCY } from "../config/wallet.js";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "TRY", trim: true, uppercase: true }
  },
  { timestamps: true }
);

walletSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    balance: Number(this.balance) || 0,
    currency: PRIMARY_WALLET_CURRENCY,
    updatedAt: this.updatedAt
  };
};

export const Wallet =
  mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

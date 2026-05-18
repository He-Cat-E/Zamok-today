import mongoose from "mongoose";
import { PRIMARY_WALLET_CURRENCY } from "../config/wallet.js";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true
    },
    type: { type: String, enum: ["top_up", "payment", "refund"], default: "top_up" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true },
    status: { type: String, enum: ["completed", "failed", "pending"], default: "completed" },
    description: { type: String, default: "" },
    cardLast4: { type: String, default: "" },
    paymentMethod: { type: String, default: "card" }
  },
  { timestamps: true }
);

walletTransactionSchema.index({ userId: 1, createdAt: -1 });

walletTransactionSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    type: this.type,
    label: this.description || "Wallet top-up",
    amount: Number(this.amount) || 0,
    currency: PRIMARY_WALLET_CURRENCY,
    status: this.status,
    cardLast4: this.cardLast4 || "",
    createdAt: this.createdAt?.toISOString?.() || new Date().toISOString()
  };
};

export const WalletTransaction =
  mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", walletTransactionSchema);

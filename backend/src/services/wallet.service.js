import { PRIMARY_WALLET_CURRENCY } from "../config/wallet.js";
import { Wallet } from "../models/Wallet.js";
import { WalletTransaction } from "../models/WalletTransaction.js";
import { cardDigits } from "../validators/wallet.validator.js";

/** Wallet is always TRY — migrates legacy USD (or other) records on access. */
export async function getOrCreateWalletForUser(userId) {
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: { userId, balance: 0 },
        $set: { currency: PRIMARY_WALLET_CURRENCY }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (wallet) return wallet;
  } catch (err) {
    if (err?.code !== 11000) throw err;
  }

  const existing = await Wallet.findOne({ userId });
  if (existing) {
    if (existing.currency !== PRIMARY_WALLET_CURRENCY) {
      existing.currency = PRIMARY_WALLET_CURRENCY;
      await existing.save();
    }
    return existing;
  }

  throw new Error("Failed to get or create wallet");
}

export async function listWalletTransactions(userId, limit = 20) {
  return WalletTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}

async function creditWallet(userId, { amount, cardNumber, holderName }) {
  const credit = Math.round(Number(amount) * 100) / 100;
  const last4 = cardDigits(cardNumber).slice(-4);
  const holder = String(holderName || "").trim();

  const wallet = await getOrCreateWalletForUser(userId);

  wallet.balance = Math.round((Number(wallet.balance) + credit) * 100) / 100;
  wallet.currency = PRIMARY_WALLET_CURRENCY;
  await wallet.save();

  const transaction = await WalletTransaction.create({
    userId,
    walletId: wallet._id,
    type: "top_up",
    amount: credit,
    currency: PRIMARY_WALLET_CURRENCY,
    status: "completed",
    description: holder ? `Top-up · ${holder}` : "Wallet top-up",
    cardLast4: last4,
    paymentMethod: "card"
  });

  return { wallet, transaction };
}

/** Simulates card capture and credits wallet. Card data is not stored (PCI-safe). */
export async function addFundsWithCard(userId, payload) {
  return creditWallet(userId, payload);
}

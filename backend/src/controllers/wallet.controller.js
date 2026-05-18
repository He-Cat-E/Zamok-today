import { getOrCreateWalletForUser, addFundsWithCard, listWalletTransactions } from "../services/wallet.service.js";
import { addFundsSchema, formatZodError } from "../validators/wallet.validator.js";

export async function getMyWallet(req, res) {
  const wallet = await getOrCreateWalletForUser(req.user._id);
  const transactions = await listWalletTransactions(req.user._id, 30);

  return res.json({
    wallet: wallet.toPublicJSON(),
    transactions: transactions.map((t) => t.toPublicJSON())
  });
}

export async function addFunds(req, res) {
  const parsed = addFundsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: formatZodError(parsed.error) });
  }

  try {
    const { wallet, transaction } = await addFundsWithCard(req.user._id, {
      amount: parsed.data.amount,
      cardNumber: parsed.data.cardNumber,
      holderName: parsed.data.holderName
    });

    return res.status(201).json({
      wallet: wallet.toPublicJSON(),
      transaction: transaction.toPublicJSON(),
      message: "Funds added successfully"
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Payment failed";
    return res.status(402).json({ error: msg || "Card payment could not be completed" });
  }
}

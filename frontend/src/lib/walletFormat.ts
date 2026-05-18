import { PRIMARY_WALLET_CURRENCY, WALLET_MONEY_LOCALE } from "@/lib/walletCurrency";

/** Formats amounts as Turkish Lira (₺) — wallet is TRY-only. */
export function formatWalletMoney(amount: number) {
  try {
    return new Intl.NumberFormat(WALLET_MONEY_LOCALE, {
      style: "currency",
      currency: PRIMARY_WALLET_CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `₺${amount.toFixed(2)}`;
  }
}

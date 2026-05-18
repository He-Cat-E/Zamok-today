/** Primary wallet currency — Turkish Lira (TRY). */
export const PRIMARY_WALLET_CURRENCY = "TRY";

/** Locale used for ₺ formatting. */
export const WALLET_MONEY_LOCALE = "tr-TR";

export const WALLET_PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000] as const;

export const WALLET_DEFAULT_AMOUNT = 1000;

export function walletCurrencyLabel(code = PRIMARY_WALLET_CURRENCY) {
  if (code === "TRY") return "TRY";
  return code;
}

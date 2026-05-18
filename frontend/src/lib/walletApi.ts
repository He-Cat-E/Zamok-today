import { env } from "@/lib/env";

export type WalletData = {
  balance: number;
  currency: string;
  updatedAt?: string;
};

export type WalletTransaction = {
  id: string;
  type?: string;
  label: string;
  amount: number;
  currency: string;
  status?: string;
  cardLast4?: string;
  createdAt: string;
};

export type AddFundsBody = {
  amount: number;
  cardNumber: string;
  expiry: string;
  cvc: string;
  holderName: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
};

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }
  return data;
}

export async function fetchMyWallet() {
  return parseJson<{ wallet: WalletData; transactions: WalletTransaction[] }>(
    await fetch(`${env.apiBaseUrl}/api/wallet/me`, { credentials: "include", cache: "no-store" })
  );
}

export async function addWalletFunds(body: AddFundsBody) {
  return parseJson<{
    wallet: WalletData;
    transaction: WalletTransaction;
    message?: string;
  }>(
    await fetch(`${env.apiBaseUrl}/api/wallet/add-funds`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FiCreditCard, FiPlus } from "react-icons/fi";
import { AccountPageShell } from "@/components/account/AccountPageShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { formatWalletMoney } from "@/lib/walletFormat";
import { PRIMARY_WALLET_CURRENCY } from "@/lib/walletCurrency";
import { useT } from "@/i18n/I18nProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWallet } from "@/store/walletSlice";
import type { WalletTransaction } from "@/lib/walletApi";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

function transactionLabel(tx: WalletTransaction, t: (key: string) => string) {
  if (tx.type === "top_up") {
    return tx.cardLast4
      ? t("wallet.txTopUpCard").replace("{last4}", tx.cardLast4)
      : t("wallet.txTopUp");
  }
  return tx.label || t("wallet.txGeneric");
}

function WalletContent() {
  const t = useT();
  const dispatch = useAppDispatch();
  const { balance, currency, transactions, status, error } = useAppSelector((s) => s.wallet);

  useEffect(() => {
    void dispatch(fetchWallet());
  }, [dispatch]);

  const displayCurrency = currency || PRIMARY_WALLET_CURRENCY;
  const loading = status === "idle" || status === "loading";

  return (
    <AccountPageShell title={t("wallet.title")} subtitle={t("wallet.subtitle")}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-2xl border border-brand-200/80 bg-white shadow-sm ring-1 ring-brand-600/10 dark:border-brand-500/25 dark:bg-zinc-950 dark:ring-brand-500/15">
          <div className="h-1 bg-brand-600" aria-hidden />
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t("wallet.availableBalance")}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:border-brand-500/35 dark:bg-brand-950/50 dark:text-brand-200">
                ₺ {PRIMARY_WALLET_CURRENCY}
              </span>
            </div>
            {loading ? (
              <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">{t("auth.pleaseWait")}</p>
            ) : error ? (
              <p className="mt-3 text-sm text-brand-600 dark:text-zinc-300">{error}</p>
            ) : (
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                {formatWalletMoney(balance)}
              </p>
            )}
            <p className="mt-1 text-xs font-medium text-brand-700 dark:text-brand-300">
              {t("wallet.currencyName")}
            </p>
            <p className="mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-400">{t("wallet.balanceHint")}</p>
            <Link
              href="/wallet/add-funds"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 dark:border-brand-500/40 dark:bg-brand-950/40 dark:text-brand-200 dark:hover:bg-brand-950/60"
            >
              <FiPlus className="h-4 w-4" />
              {t("wallet.addFunds")}
            </Link>
          </div>
        </section>

        <aside className="overflow-hidden rounded-2xl border border-brand-200/80 bg-white shadow-sm ring-1 ring-brand-600/10 dark:border-brand-500/25 dark:bg-zinc-950 dark:ring-brand-500/15">
          <div className="h-1 bg-brand-600" aria-hidden />
          <div className="p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-500/35 dark:bg-brand-950/50 dark:text-brand-300">
                <FiCreditCard className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">{t("wallet.quickInfo")}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("wallet.quickInfoHint")}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-white/10">
                <span>{t("wallet.currency")}</span>
                <span className="text-right font-semibold text-zinc-900 dark:text-white">
                  {t("wallet.currencyName")}
                  <span className="mt-0.5 block text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    {PRIMARY_WALLET_CURRENCY}
                  </span>
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span>{t("wallet.status")}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-300">{t("wallet.statusActive")}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:border-white/10 dark:bg-zinc-950 dark:ring-white/10">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{t("wallet.transactions")}</h2>
        {transactions.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-14 text-center dark:border-white/15 dark:bg-black/40">
            <FiCreditCard className="h-10 w-10 text-zinc-300 dark:text-zinc-600" aria-hidden />
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("wallet.noTransactions")}</p>
            <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-500">{t("wallet.noTransactionsHint")}</p>
            <Link
              href="/wallet/add-funds"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <FiPlus className="h-4 w-4" />
              {t("wallet.addFunds")}
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100 dark:divide-white/10">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-4 py-4 first:pt-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {transactionLabel(tx, t)}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{formatDate(tx.createdAt)}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatWalletMoney(tx.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AccountPageShell>
  );
}

export default function WalletPage() {
  return (
    <RequireAuth>
      <WalletContent />
    </RequireAuth>
  );
}

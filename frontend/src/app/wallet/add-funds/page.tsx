"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { AccountPageShell } from "@/components/account/AccountPageShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AddFundsForm } from "@/components/wallet/AddFundsForm";
import { formatWalletMoney } from "@/lib/walletFormat";
import { PRIMARY_WALLET_CURRENCY } from "@/lib/walletCurrency";
import { useT } from "@/i18n/I18nProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWallet, resetAddFundsStatus } from "@/store/walletSlice";

function AddFundsContent() {
  const t = useT();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { balance, currency, status } = useAppSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(resetAddFundsStatus());
    void dispatch(fetchWallet());
  }, [dispatch]);

  const displayCurrency = currency || PRIMARY_WALLET_CURRENCY;
  const loading = status === "idle" || status === "loading";

  function onSuccess() {
    router.push("/wallet");
  }

  return (
    <AccountPageShell title={t("wallet.addFundsTitle")} subtitle={t("wallet.addFundsSubtitle")}>
      <Link
        href="/wallet"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-300"
      >
        <FiArrowLeft className="h-4 w-4" aria-hidden />
        {t("wallet.backToWallet")}
      </Link>

      {!loading ? (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-brand-200/60 bg-brand-50/80 px-4 py-3 text-sm dark:border-brand-500/30 dark:bg-brand-950/30">
          <FiShield className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
          <p className="text-zinc-700 dark:text-zinc-300">
            {t("wallet.addFundsBalanceNote").replace(
              "{balance}",
              formatWalletMoney(balance)
            )}
          </p>
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-2 py-0.5 text-xs font-bold text-brand-700 dark:border-brand-500/35 dark:bg-brand-950/60 dark:text-brand-200">
            ₺ {PRIMARY_WALLET_CURRENCY}
          </span>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("auth.pleaseWait")}</p>
      ) : (
        <AddFundsForm
          currency={displayCurrency}
          currentBalance={balance}
          onSuccess={onSuccess}
        />
      )}
    </AccountPageShell>
  );
}

export default function AddFundsPage() {
  return (
    <RequireAuth>
      <AddFundsContent />
    </RequireAuth>
  );
}

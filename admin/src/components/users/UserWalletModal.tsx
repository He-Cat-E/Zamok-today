"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  fetchAdminUserWallet,
  type AdminUserWalletResponse,
  type AdminUserWalletTransaction
} from "@/lib/adminApi";
import { useT } from "@/i18n/I18nProvider";

type Props = {
  userId: string;
  userName: string;
  onClose: () => void;
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "TRY",
      minimumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch {
    return iso;
  }
}

export function UserWalletModal({ userId, userName, onClose }: Props) {
  const t = useT();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminUserWalletResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetchAdminUserWallet(userId)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("users.wallet.loadError"));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, t]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const transactions = data?.transactions ?? [];

  return (
    <div
      className="zt-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="zt-modal" role="dialog" aria-labelledby="wallet-modal-title">
        <div className="zt-modal-header">
          <h2 id="wallet-modal-title" className="zt-modal-title">
            {t("users.wallet.title")}
          </h2>
          <p className="zt-modal-subtitle">{userName}</p>
          <button type="button" className="zt-modal-close" onClick={onClose} aria-label={t("users.wallet.close")}>
            <FiX size={20} />
          </button>
        </div>

        <div className="zt-modal-body">
          {loading ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("users.wallet.loading")}</p>
          ) : null}
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          {!loading && !error && data ? (
            <>
              <div className="zt-wallet-balance-card">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t("users.wallet.balance")}
                </span>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {formatMoney(data.wallet.balance, data.wallet.currency)}
                </p>
                {data.user.email ? (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{data.user.email}</p>
                ) : null}
                {data.user.phone ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{data.user.phone}</p>
                ) : null}
              </div>

              <h3 className="mb-2 mt-5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {t("users.wallet.recentTransactions")}
              </h3>
              {transactions.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("users.wallet.noTransactions")}</p>
              ) : (
                <ul className="zt-wallet-tx-list">
                  {transactions.map((tx: AdminUserWalletTransaction) => (
                    <li key={tx.id} className="zt-wallet-tx-item">
                      <div>
                        <span className="font-medium text-zinc-800 dark:text-zinc-100">{tx.label}</span>
                        <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDate(tx.createdAt)}
                          {tx.cardLast4 ? ` · •••• ${tx.cardLast4}` : ""}
                        </span>
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatMoney(tx.amount, tx.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

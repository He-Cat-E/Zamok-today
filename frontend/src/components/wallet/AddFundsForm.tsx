"use client";

import { useEffect, useMemo, useState } from "react";
import { FiLock, FiShield } from "react-icons/fi";
import { CountrySelect } from "@/components/CountrySelect";
import { CardPreview } from "@/components/wallet/CardPreview";
import { buildCountryList, countryNameForCode } from "@/lib/countries";
import { formatCardNumber, formatCvc, formatExpiry } from "@/lib/cardFormat";
import {
  PRIMARY_WALLET_CURRENCY,
  WALLET_DEFAULT_AMOUNT,
  WALLET_PRESET_AMOUNTS
} from "@/lib/walletCurrency";
import { formatWalletMoney } from "@/lib/walletFormat";
import { useT } from "@/i18n/I18nProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFunds, type AddFundsPayload } from "@/store/walletSlice";
import { toast } from "@/lib/toast";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 dark:border-white/12 dark:bg-zinc-900 dark:text-white dark:focus:border-brand-500";

const labelClass = "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-brand-200/80 bg-white shadow-sm ring-1 ring-brand-600/10 dark:border-brand-500/25 dark:bg-zinc-950 dark:ring-brand-500/15">
      <div className="h-1 bg-brand-600" aria-hidden />
      <div className="border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function AddFundsForm({
  currency = PRIMARY_WALLET_CURRENCY,
  currentBalance,
  onSuccess
}: {
  currency?: string;
  currentBalance: number;
  onSuccess: () => void;
}) {
  const t = useT();
  const dispatch = useAppDispatch();
  const localeCountry = useAppSelector((s) => s.locale.country);
  const formId = "add-funds-form";
  const countries = useMemo(() => buildCountryList("en"), []);

  const [amount, setAmount] = useState(String(WALLET_DEFAULT_AMOUNT));
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (countryCode) return;
    const code = String(localeCountry || "")
      .trim()
      .toUpperCase();
    if (/^[A-Z]{2}$/.test(code)) setCountryCode(code);
  }, [countryCode, localeCountry]);

  const numericAmount = Math.max(0, Number(amount) || 0);
  const newBalance = Math.round((currentBalance + numericAmount) * 100) / 100;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload: AddFundsPayload = {
      amount: numericAmount,
      cardNumber,
      expiry,
      cvc,
      holderName,
      billingAddress: {
        line1,
        line2: line2 || undefined,
        city,
        state: state || undefined,
        postalCode,
        country: countryNameForCode(countries, countryCode)
      },
    };

    const result = await dispatch(addFunds(payload));
    setSubmitting(false);

    if (addFunds.fulfilled.match(result)) {
      toast.success(t("toast.wallet.fundsAdded"));
      onSuccess();
      return;
    }

    toast.error(typeof result.payload === "string" ? result.payload : t("auth.error.generic"));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(100%,480px)] lg:items-start xl:gap-10">
      <form id={formId} onSubmit={onSubmit} className="space-y-6">
        <SectionCard title={t("wallet.amountSection")} description={t("wallet.amountSectionHint")}>
          <div className="flex flex-wrap gap-2">
            {WALLET_PRESET_AMOUNTS.map((preset) => {
              const active = Number(amount) === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(String(preset))}
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-brand-300 hover:bg-brand-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-brand-500/40"
                  ].join(" ")}
                >
                  ₺{preset.toLocaleString("tr-TR")}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <label htmlFor="fund-amount" className={labelClass}>
              {t("wallet.customAmount")} (₺ {PRIMARY_WALLET_CURRENCY})
            </label>
            <input
              id="fund-amount"
              type="number"
              min={1}
              max={50000}
              step={1}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />
          </div>
        </SectionCard>

        <SectionCard title={t("wallet.cardDetails")} description={t("wallet.cardDetailsHint")}>
          <div className="space-y-4">
            <div>
              <label htmlFor="card-number" className={labelClass}>
                {t("wallet.cardNumber")}
              </label>
              <input
                id="card-number"
                inputMode="numeric"
                autoComplete="cc-number"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="card-expiry" className={labelClass}>
                  {t("wallet.expiry")}
                </label>
                <input
                  id="card-expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="card-cvc" className={labelClass}>
                  {t("wallet.cvc")}
                </label>
                <input
                  id="card-cvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  required
                  value={cvc}
                  onChange={(e) => setCvc(formatCvc(e.target.value))}
                  placeholder="123"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="card-holder" className={labelClass}>
                {t("wallet.holderName")}
              </label>
              <input
                id="card-holder"
                autoComplete="cc-name"
                required
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder={t("wallet.holderNamePlaceholder")}
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("wallet.billingAddress")} description={t("wallet.billingAddressHint")}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bill-line1" className={labelClass}>
                {t("wallet.addressLine1")}
              </label>
              <input
                id="bill-line1"
                autoComplete="address-line1"
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bill-line2" className={labelClass}>
                {t("wallet.addressLine2")}
              </label>
              <input
                id="bill-line2"
                autoComplete="address-line2"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="bill-city" className={labelClass}>
                  {t("wallet.city")}
                </label>
                <input
                  id="bill-city"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="bill-state" className={labelClass}>
                  {t("wallet.state")}
                </label>
                <input
                  id="bill-state"
                  autoComplete="address-level1"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="bill-postal" className={labelClass}>
                  {t("wallet.postalCode")}
                </label>
                <input
                  id="bill-postal"
                  autoComplete="postal-code"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="bill-country" className={labelClass}>
                  {t("wallet.country")}
                </label>
                <CountrySelect
                  id="bill-country"
                  value={countryCode}
                  onChange={(code) => setCountryCode(code)}
                  required
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <p className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 lg:hidden">
          <FiLock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t("wallet.secureNote")}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60 lg:hidden dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {submitting ? t("auth.pleaseWait") : t("wallet.payAndAdd")}
        </button>
      </form>

      <aside className="lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-2xl border border-brand-200/80 bg-white shadow-md ring-1 ring-brand-600/10 dark:border-brand-500/25 dark:bg-zinc-950 dark:ring-brand-500/15">
          <div className="h-1.5 bg-brand-600" aria-hidden />
          <div className="p-7">
            <div className="-mx-6 -mt-6 mb-6 border-b border-brand-100 bg-brand-50/60 px-6 py-5 dark:border-brand-500/20 dark:bg-brand-950/40">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand-200 bg-white text-brand-600 shadow-sm dark:border-brand-500/30 dark:bg-brand-950/60">
                  <FiShield className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("wallet.orderSummary")}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("wallet.orderSummaryHint")}</p>
                </div>
              </div>
            </div>

            <div className="mt-0">
              <CardPreview cardNumber={cardNumber} holderName={holderName} expiry={expiry} className="max-w-none" />
            </div>

            <dl className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3.5 dark:border-white/10 dark:bg-zinc-900/50">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">{t("wallet.currentBalance")}</dt>
                <dd className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {formatWalletMoney(currentBalance)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-200/80 bg-brand-50 px-4 py-3.5 dark:border-brand-500/30 dark:bg-brand-950/50">
                <dt className="text-sm font-medium text-brand-800 dark:text-brand-200">{t("wallet.amountToAdd")}</dt>
                <dd className="text-sm font-bold text-brand-600 dark:text-brand-300">
                  +{formatWalletMoney(numericAmount)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-400/50 bg-brand-600 px-4 py-4 text-white shadow-sm shadow-brand-900/20">
                <dt className="text-sm font-medium text-brand-100">{t("wallet.newBalance")}</dt>
                <dd className="text-xl font-bold tracking-tight">
                  {formatWalletMoney(newBalance)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 flex items-start gap-2 rounded-lg border border-brand-100 bg-brand-50/50 px-3 py-2.5 text-xs leading-relaxed text-zinc-600 dark:border-brand-500/25 dark:bg-brand-950/30 dark:text-zinc-400">
              <FiLock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
              {t("wallet.secureNote")}
            </p>

            <button
              type="submit"
              form={formId}
              disabled={submitting}
              className="mt-6 hidden w-full rounded-xl bg-brand-600 py-4 text-sm font-semibold text-white shadow-md shadow-brand-900/15 transition hover:bg-brand-700 disabled:opacity-60 lg:block"
            >
              {submitting ? t("auth.pleaseWait") : t("wallet.payAndAdd")}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

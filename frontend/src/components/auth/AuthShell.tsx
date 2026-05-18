"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";
import styles from "./AuthShell.module.css";

export function AuthShell({
  subtitle,
  children,
  footer
}: {
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const t = useT();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logoRow}>
            <Image
              src="/logo.png"
              alt="Zamok Today"
              width={48}
              height={48}
              className={styles.logoImg}
              priority
            />
            <div>
              <div className={styles.brandTitle}>Zamok Today</div>
              <div className={styles.brandTagline}>{t("auth.tagline")}</div>
            </div>
          </Link>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {children}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}

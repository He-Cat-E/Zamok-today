"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./AuthShell.module.css";

export function AuthShell({
  children,
  subtitle,
  footer
}: {
  children: React.ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logoLink} aria-label="Zamok Today">
            <Image
              src="/logo.png"
              alt=""
              width={80}
              height={80}
              className={styles.logoImg}
              priority
            />
          </Link>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
        {children}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}

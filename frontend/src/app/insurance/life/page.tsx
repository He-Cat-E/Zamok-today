import type { Metadata } from "next";
import { LifeInsuranceClient } from "./LifeInsuranceClient";

export const metadata: Metadata = {
  title: "Life Insurance — Zamok Today",
  description:
    "Secure your family's future with life insurance tailored to your needs. Compare cover, benefits, and indicative options — İlsa Insurance illustrative product page."
};

export default function LifeInsurancePage() {
  return <LifeInsuranceClient />;
}

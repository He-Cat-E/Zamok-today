import type { Metadata } from "next";
import { SupplementaryHealthInsuranceClient } from "./SupplementaryHealthInsuranceClient";

export const metadata: Metadata = {
  title: "Supplementary Health Insurance (TSS) — Zamok Today",
  description:
    "Supplementary health insurance (TSS) for SGK members — private hospital access without fee differences, coverage overview, and quotes with İlsa Insurance, Ankara."
};

export default function SupplementaryHealthInsurancePage() {
  return <SupplementaryHealthInsuranceClient />;
}

import type { Metadata } from "next";
import { HealthInsuranceClient } from "./HealthInsuranceClient";

export const metadata: Metadata = {
  title: "Health Insurance — Zamok Today",
  description:
    "Individual and family health insurance, coverage overview, supplementary (SGK) plans, and pricing factors — İlsa Insurance illustrative product page."
};

export default function HealthInsurancePage() {
  return <HealthInsuranceClient />;
}

import type { Metadata } from "next";
import { ComprehensiveCarInsuranceClient } from "./ComprehensiveCarInsuranceClient";

export const metadata: Metadata = {
  title: "Comprehensive Car Insurance — Zamok Today",
  description:
    "Optional comprehensive car insurance against accidents, theft, fire, natural disasters, and more. İlsa Insurance — illustrative product page."
};

export default function ComprehensiveCarInsurancePage() {
  return <ComprehensiveCarInsuranceClient />;
}

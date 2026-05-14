import type { Metadata } from "next";
import { PersonalAccidentInsuranceClient } from "./PersonalAccidentInsuranceClient";

export const metadata: Metadata = {
  title: "Personal Accident Insurance — Zamok Today",
  description:
    "Personal accident insurance for death, disability, and medical expenses after unexpected accidents — compare options with İlsa Insurance, Ankara."
};

export default function PersonalAccidentInsurancePage() {
  return <PersonalAccidentInsuranceClient />;
}

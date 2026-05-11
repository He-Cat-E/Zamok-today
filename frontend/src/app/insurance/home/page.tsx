import type { Metadata } from "next";
import { HomeInsuranceClient } from "./HomeInsuranceClient";

export const metadata: Metadata = {
  title: "Home Insurance — Zamok Today",
  description:
    "Protect your home and contents with tailored home insurance. DASK vs home cover, benefits, and pricing factors — İlsa Insurance illustrative product page."
};

export default function HomeInsurancePage() {
  return <HomeInsuranceClient />;
}

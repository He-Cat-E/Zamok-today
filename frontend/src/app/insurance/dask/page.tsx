import type { Metadata } from "next";
import { DaskInsuranceClient } from "./DaskInsuranceClient";

export const metadata: Metadata = {
  title: "DASK (Compulsory Earthquake Insurance) — Zamok Today",
  description:
    "Compulsory earthquake insurance (DASK) in Türkiye — coverage, pricing, UAVT address code, and renewal guidance with İlsa Insurance, Ankara."
};

export default function DaskInsurancePage() {
  return <DaskInsuranceClient />;
}

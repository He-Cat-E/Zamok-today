import type { Metadata } from "next";
import { MotorbikeInsuranceClient } from "./MotorbikeInsuranceClient";

export const metadata: Metadata = {
  title: "Compulsory Traffic Insurance (Motorbike) — Zamok Today",
  description:
    "Compulsory motor liability insurance for motorbikes and scooters — third-party cover, quotes in Ankara, İlsa Insurance illustrative product page."
};

export default function MotorbikeInsurancePage() {
  return <MotorbikeInsuranceClient />;
}

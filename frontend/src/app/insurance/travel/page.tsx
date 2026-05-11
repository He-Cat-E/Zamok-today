import type { Metadata } from "next";
import { TravelInsuranceClient } from "./TravelInsuranceClient";

export const metadata: Metadata = {
  title: "Travel Insurance — Zamok Today",
  description:
    "Secure your journeys with travel insurance: medical cover, baggage, cancellation, Schengen-friendly certificates — İlsa Insurance illustrative product page."
};

export default function TravelInsurancePage() {
  return <TravelInsuranceClient />;
}

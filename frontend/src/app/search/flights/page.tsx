import { Suspense } from "react";
import { FlightRouteSearchClient } from "./FlightRouteSearchClient";

export default function FlightRouteSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-slate-50 dark:bg-black" aria-busy="true" />
      }
    >
      <FlightRouteSearchClient />
    </Suspense>
  );
}

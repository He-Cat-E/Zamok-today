export type FlightSearchRequest = {
  from: string;
  to: string;
  departDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  passengers: number;
  cabin: "economy" | "premium" | "business" | "first";
};

export type FlightOffer = {
  id: string;
  price: {
    amount: number;
    currency: string;
  };
  segments: Array<{
    from: string;
    to: string;
    departAt: string; // ISO
    arriveAt: string; // ISO
    carrier: string;
    flightNumber: string;
    durationMinutes: number;
    stops: number;
  }>;
  deepLink?: string;
};


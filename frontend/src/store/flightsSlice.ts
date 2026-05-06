import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FlightOffer, FlightSearchRequest } from "@/lib/types";
import { env } from "@/lib/env";
import { SITE_DEFAULT_TO_CITY, SITE_PRIMARY_FROM_CITY } from "@/lib/siteDefaults";

type FlightSearchForm = {
  from: string;
  fromIata: string;
  to: string;
  departDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabin: FlightSearchRequest["cabin"];
};

type FlightsState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  lastQuery?: FlightSearchRequest;
  offers: FlightOffer[];
  searchForm: FlightSearchForm;
};

const initialState: FlightsState = {
  status: "idle",
  offers: [],
  searchForm: {
    from: SITE_PRIMARY_FROM_CITY,
    fromIata: "",
    to: SITE_DEFAULT_TO_CITY,
    departDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    cabin: "economy"
  }
};

export const searchFlights = createAsyncThunk<
  { offers: FlightOffer[] },
  FlightSearchRequest,
  { rejectValue: string }
>("flights/search", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch(`${env.apiBaseUrl}/api/flights/search`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      return rejectWithValue(text || `Request failed (${res.status})`);
    }
    return (await res.json()) as { offers: FlightOffer[] };
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : "Unknown error");
  }
});

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setFlightSearchForm: (state, action: PayloadAction<Partial<FlightSearchForm>>) => {
      state.searchForm = {
        ...state.searchForm,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state, action) => {
        state.status = "loading";
        state.error = undefined;
        state.lastQuery = action.meta.arg;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.offers = action.payload.offers;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (typeof action.payload === "string" && action.payload) ||
          action.error.message ||
          "Request failed";
      });
  }
});

export const flightsReducer = flightsSlice.reducer;
export const { setFlightSearchForm } = flightsSlice.actions;


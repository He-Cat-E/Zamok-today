import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { FlightOffer, FlightSearchRequest } from "@/lib/types";
import { env } from "@/lib/env";

type FlightsState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  lastQuery?: FlightSearchRequest;
  offers: FlightOffer[];
};

const initialState: FlightsState = {
  status: "idle",
  offers: []
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
  reducers: {},
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


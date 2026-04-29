import { configureStore } from "@reduxjs/toolkit";
import { flightsReducer } from "@/store/flightsSlice";
import { localeReducer } from "@/store/localeSlice";

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    locale: localeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


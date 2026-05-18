import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/store/authSlice";
import { flightsReducer } from "@/store/flightsSlice";
import { localeReducer } from "@/store/localeSlice";
import { walletReducer } from "@/store/walletSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightsReducer,
    locale: localeReducer,
    wallet: walletReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LocaleState = {
  country: string;
  language: string;
  currency: string;
};

const initialState: LocaleState = {
  country: "TR",
  language: "tr",
  currency: "TRY"
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload.toUpperCase();
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload.toUpperCase();
    },
    setLocale(state, action: PayloadAction<Partial<LocaleState>>) {
      const next = action.payload;
      if (next.country) state.country = String(next.country).toUpperCase();
      if (next.language) state.language = String(next.language);
      if (next.currency) state.currency = String(next.currency).toUpperCase();
    }
  }
});

export const { setCountry, setLanguage, setCurrency, setLocale } = localeSlice.actions;
export const localeReducer = localeSlice.reducer;


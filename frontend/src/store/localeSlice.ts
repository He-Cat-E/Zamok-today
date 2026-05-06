import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LocaleState = {
  country: string;
  countryName: string;
  language: string;
  currency: string;
  originIata: string;
  originCityName: string;
};

const initialState: LocaleState = {
  country: "TR",
  countryName: "",
  language: "tr",
  currency: "TRY",
  originIata: "",
  originCityName: ""
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload.toUpperCase();
    },
    setCountryName(state, action: PayloadAction<string>) {
      state.countryName = String(action.payload || "").trim();
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload.toUpperCase();
    },
    setOriginIata(state, action: PayloadAction<string>) {
      state.originIata = String(action.payload).toUpperCase();
    },
    setOriginCityName(state, action: PayloadAction<string>) {
      state.originCityName = String(action.payload || "").trim();
    },
    setLocale(state, action: PayloadAction<Partial<LocaleState>>) {
      const next = action.payload;
      if (next.country) state.country = String(next.country).toUpperCase();
      if (typeof next.countryName === "string") state.countryName = String(next.countryName).trim();
      if (next.language) state.language = String(next.language);
      if (next.currency) state.currency = String(next.currency).toUpperCase();
      if (next.originIata) state.originIata = String(next.originIata).toUpperCase();
      if (typeof next.originCityName === "string") state.originCityName = String(next.originCityName).trim();
    }
  }
});

export const { setCountry, setCountryName, setLanguage, setCurrency, setOriginIata, setOriginCityName, setLocale } = localeSlice.actions;
export const localeReducer = localeSlice.reducer;


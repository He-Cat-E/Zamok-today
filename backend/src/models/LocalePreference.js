import mongoose from "mongoose";

const localePreferenceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    country: { type: String, required: true },
    language: { type: String, required: true },
    currency: { type: String, required: true }
  },
  { timestamps: true }
);

export const LocalePreference =
  mongoose.models.LocalePreference || mongoose.model("LocalePreference", localePreferenceSchema);

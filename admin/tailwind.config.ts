import type { Config } from "tailwindcss";
import tailwindColors from "tailwindcss/colors";
import { brandRed } from "./src/theme/brand";

const {
  lightBlue,
  warmGray,
  trueGray,
  coolGray,
  blueGray,
  red: _defaultRed,
  ...baseColors
} = tailwindColors;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      ...baseColors,
      red: { ...brandRed },
      brand: { ...brandRed }
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

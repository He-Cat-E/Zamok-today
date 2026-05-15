import type { Config } from "tailwindcss";
import tailwindColors from "tailwindcss/colors";
import { brandRed } from "./src/theme/brand";

/** Tailwind default palette minus deprecated names and `red` (replaced by brand). */
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
      },
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.25rem" }],
        sm: ["1rem", { lineHeight: "1.5rem" }],
        base: ["1.125rem", { lineHeight: "1.75rem" }],
        lg: ["1.25rem", { lineHeight: "1.875rem" }]
      },
      keyframes: {
        expertFadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" }
        }
      },
      animation: {
        expertFadeIn: "expertFadeIn 0.35s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";
import tailwindColors from "tailwindcss/colors";
import { brandRed } from "./src/theme/brand";

/** Omit deprecated palette aliases (sky/stone/neutral/gray/slate) without reading them — avoids Tailwind warnings. */
const OMIT_COLOR_KEYS = new Set([
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
  "red"
]);

const baseColors = Object.fromEntries(
  (Object.keys(tailwindColors) as (keyof typeof tailwindColors)[]).flatMap((key) =>
    OMIT_COLOR_KEYS.has(key) ? [] : [[key, tailwindColors[key]]]
  )
);

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

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      },
      fontSize: {
        // Enforce minimum readable size across UI
        xs: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        sm: ["1rem", { lineHeight: "1.5rem" }], // 16px
        base: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        lg: ["1.25rem", { lineHeight: "1.875rem" }] // 20px
      }
    }
  },
  plugins: []
};

export default config;


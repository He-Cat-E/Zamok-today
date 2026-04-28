import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const recoleta = localFont({
  variable: "--font-recoleta",
  display: "swap",
  src: [
    { path: "../../public/fonts/Recoleta/Recoleta-Thin.woff2", weight: "100", style: "normal" },
    { path: "../../public/fonts/Recoleta/Recoleta-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Recoleta/Recoleta-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Recoleta/Recoleta-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Recoleta/Recoleta-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Recoleta/Recoleta-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Recoleta/Recoleta-Black.woff2", weight: "900", style: "normal" }
  ]
});


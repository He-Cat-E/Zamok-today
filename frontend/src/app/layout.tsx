import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "@/store/Providers";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { inter, recoleta } from "@/theme/fonts";

export const metadata: Metadata = {
  title: "Zamok Today — Flights",
  description: "Aviasales-style flight search starter",
  icons: {
    icon: "/icon.jfif",
    shortcut: "/icon.jfif",
    apple: "/icon.jfif"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="tpembars-loader"
          strategy="afterInteractive"
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          seraph-accel-crit="1"
          data-no-defer="1"
        >
          {`(function () {
      var script = document.createElement("script");
      script.async = 1;
      script.src = 'https://tpembars.com/NTI1MTc2.js?t=525176';
      document.head.appendChild(script);
  })();`}
        </Script>
      </head>
      <body className={`${inter.variable} ${recoleta.variable}`}>
        <Providers>
          <ThemeProvider>
            <I18nProvider>{children}</I18nProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}


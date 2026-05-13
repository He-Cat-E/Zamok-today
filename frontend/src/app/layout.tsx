import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "@/store/Providers";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { manrope, recoleta } from "@/theme/fonts";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { HomeInitialLoader } from "@/components/home/HomeInitialLoader";

export const metadata: Metadata = {
  title: "Zamok Today — Flights",
  description: "Aviasales-style flight search starter",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png"
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
      <body className={`${manrope.variable} ${recoleta.variable}`}>
        <Providers>
          <ThemeProvider>
            <I18nProvider>
              <HomeInitialLoader />
              {children}
              <ScrollToTopButton />
            </I18nProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}


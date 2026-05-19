import "./globals.css";
import type { Metadata } from "next";
import { ThemeScript } from "@/components/ThemeScript";
import { manrope } from "@/theme/fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Zamok Today — Admin",
  description: "Zamok Today administration panel",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={manrope.variable}>
        <ThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

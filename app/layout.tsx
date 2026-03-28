import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/common/AppProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUXE Estates | Premium Real Estate",
  description: "Find your dream luxury property with LUXE Estates. Expert agents, real guidance, and a clear path to your perfect home.",
  keywords: ["luxury real estate", "premium properties", "estate agents", "home buying"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white dark:bg-neutral-950 antialiased font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

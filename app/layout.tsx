import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/common/AppProviders";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  title: "KingSquare | Premium Real Estate",
  description: "Find your dream luxury property with KingSquare. Expert agents, real guidance, and a clear path to your perfect home.",
  keywords: ["luxury real estate", "premium properties", "estate agents", "home buying"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable, "font-sans", geist.variable, "dark")}>
      <body className="min-h-screen bg-[#070707] text-neutral-50 antialiased font-sans selection:bg-gold-500/30 selection:text-gold-100">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}


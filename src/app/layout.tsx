import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const serifAcc = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-acc",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CyberVault AI — Autonomous Agent Storefront",
    template: "%s · CyberVault AI",
  },
  description:
    "Deploy production-grade AI security agents in minutes. Sentinel Prime, Cipher Intelligence, Aegis Wall and more — the open marketplace for autonomous cyber defense.",
  keywords: [
    "AI agents",
    "cybersecurity",
    "autonomous SOC",
    "threat intelligence",
    "agent marketplace",
    "CyberVault AI",
  ],
  openGraph: {
    title: "CyberVault AI — Autonomous Agent Storefront",
    description: "Deploy production-grade AI security agents in minutes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${inter.variable} ${jetbrains.variable} ${serifAcc.variable}`}
    >
      <body>
        <div className="noise-overlay" aria-hidden />
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

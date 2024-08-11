import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@ui/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Money Monkey",
  description: "Simple expense tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <body className={inter.className + " flex flex-col h-screen"}>
        <ClerkProvider>
          <NavBar />
          <main className="flex-grow bg-white text-black">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@ui/NavBar";
import UserSettingsProvider from "@lib/userSettings";
import { getCategories } from "@lib/api";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Money Monkey",
  description: "Simple expense tracking",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {}

  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <body className={`${inter.className} relative h-screen`}>
        <ClerkProvider>
          <UserSettingsProvider categories={categories}>
            <NavBar />
            <main className="flex-grow h-full bg-white text-black">
              {children}
            </main>
          </UserSettingsProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

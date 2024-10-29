import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@ui/NavBar";
import UserSettingsProvider from "@lib/userSettings";
import { db } from "@lib/db";
import { categoryTable } from "@lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

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
  const user_id = auth().userId;
  const categories: Category[] = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.user_id, user_id));

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

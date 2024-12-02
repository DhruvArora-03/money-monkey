import NavBar from "@/components/NavBar";
import UserSettingsProvider from "@/lib/userSettings";
import { db } from "@/lib/db";
import {
  SelectCategory,
  SelectExpense,
  dbCategories,
  dbExpenses,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const categories: SelectCategory[] = await db.query.dbCategories.findMany({
    where: eq(dbCategories.profile_id, user!.id),
  });
  const expenses: SelectExpense[] = await db.query.dbExpenses.findMany({
    where: eq(dbExpenses.profile_id, user!.id),
  });

  return (
    <UserSettingsProvider categories={categories} expenses={expenses}>
      <NavBar />
      <main className="flex-grow min-h-full bg-white text-black pb-16">
        {children}
      </main>
    </UserSettingsProvider>
  );
}

import NavBar from "@/components/NavBar";
import UserSettingsProvider from "@/lib/userSettings";
import { SelectCategory, SelectExpense } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCategories, getExpenses } from "@/lib/db/queries";

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

  const categories: Promise<SelectCategory[]> = getCategories(user!.id);
  const expenses: Promise<SelectExpense[]> = getExpenses(user!.id);

  await Promise.all([categories, expenses]);

  return (
    <UserSettingsProvider
      categories={await categories}
      expenses={await expenses}
    >
      <NavBar />
      <main className="flex-grow min-h-full bg-white text-black pb-16">
        {children}
      </main>
    </UserSettingsProvider>
  );
}

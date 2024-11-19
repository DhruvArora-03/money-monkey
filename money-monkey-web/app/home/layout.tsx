import NavBar from "@/components/NavBar";
import UserSettingsProvider from "@/lib/userSettings";
import { db } from "@/lib/db";
import { SelectCategory } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/login");
  }

  const categories: SelectCategory[] = await db.query.categories.findMany();

  return (
    <UserSettingsProvider categories={categories}>
      <NavBar />
      <main className="flex-grow min-h-full bg-white text-black pb-16">
        {children}
      </main>
    </UserSettingsProvider>
  );
}

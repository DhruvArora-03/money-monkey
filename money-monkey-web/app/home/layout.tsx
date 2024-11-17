import NavBar from "@/components/NavBar";
import UserSettingsProvider from "@/lib/userSettings";
import { db } from "@/lib/db";
import { categoryTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const categories: Category[] = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.user_id, data.user!.id));

  return (
    <UserSettingsProvider categories={categories}>
      <NavBar />
      <main className="flex-grow min-h-full bg-white text-black pb-16">
        {children}
      </main>
    </UserSettingsProvider>
  );
}

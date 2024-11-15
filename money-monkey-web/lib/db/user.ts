import { DEFAULT_CATEGORIES } from "@/lib/const";
import { db } from "@/lib/db";
import { categoryTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createUser(userId: string): Promise<void> {
  const existing = (
    await db
      .select({ name: categoryTable.name })
      .from(categoryTable)
      .where(eq(categoryTable.user_id, userId))
  ).map((e) => e.name);

  const categories = DEFAULT_CATEGORIES.filter(
    (cat) => !existing.includes(cat.name)
  ).map((cat) => ({ ...cat, user_id: userId }));

  if (categories.length > 0) {
    await db.insert(categoryTable).values(categories);
  }
}

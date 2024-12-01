import { db } from "@/lib/db";
import { SelectExpense, dbCategories, dbExpenses } from "@/lib/db/schema";
import ExpenseList from "@/components/ExpenseList";
import NewExpenseButton from "@/components/NewExpenseButton";
import { and, desc, eq, isNull, or, sql, sum } from "drizzle-orm";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
  }

  let userExpenses: SelectExpense[] = [];
  try {
    userExpenses = await db.query.dbExpenses.findMany({
      orderBy: (expenses, { desc }) => [desc(expenses.date)],
    });
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
  }

  let sums: CategorySum[] = [];
  try {
    const currDate = new Date(2024, 7, 1);
    const columns = {
      category_id: dbCategories.id,
      month: sql`extract(month from ${dbExpenses.date})`.mapWith(Number),
      year: sql`extract(year from ${dbExpenses.date})`.mapWith(Number),
      total_cents: sum(sql`coalesce(${dbExpenses.amount_cents}, 0)`).mapWith(
        Number
      ),
    };
    sums = await db
      .select(columns)
      .from(dbCategories)
      .leftJoin(dbExpenses, and(eq(dbCategories.id, dbExpenses.category_id)))
      .where(
        and(
          eq(dbCategories.profile_id, data.user!.id),
          or(
            and(
              isNull(columns.month),
              isNull(columns.year),
              isNull(dbExpenses.profile_id)
            ),
            and(
              eq(columns.month, currDate.getMonth() + 1),
              eq(columns.year, currDate.getFullYear()),
              eq(dbExpenses.profile_id, data.user!.id)
            )
          )
        )
      )
      .groupBy(columns.category_id, columns.month, columns.year)
      .orderBy(desc(columns.total_cents));
  } catch (error) {
    console.error("Failed to fetch sums:", error);
  }

  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <NewExpenseButton
        className="absolute right-0 p-3 md:pt-0 md:pr-6"
        userId={data.user!.id}
      />
      <div className="overflow-hidden w-full pt-16 md:pb-6 md:pt-0 border-gray-300 max-w-7xl mx-auto">
        <CategoryPieChart className="mx-auto min-h-fit" sums={sums} />
        {/* <CategoryList sums={sums} /> */}
      </div>
      <div className="w-full md:w-2/3 overflow-hidden px-6">
        <ExpenseList expenses={userExpenses} />
      </div>
    </div>
  );
}

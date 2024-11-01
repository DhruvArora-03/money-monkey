import { auth } from "@clerk/nextjs/server";
import { db } from "@lib/db";
import { categoryTable, expenseTable } from "@lib/db/schema";
import CategoryList from "@ui/CategoryList";
import ExpenseList from "@ui/ExpenseList";
import MainSpendDisplay from "@ui/MainSpendDisplay";
import NewExpenseButton from "@ui/NewExpenseButton";
import { and, desc, eq, isNull, or, sql, sum } from "drizzle-orm";

export default async function HomePage() {
  const userId = auth().userId!;

  let expenses: Expense[] = [];
  try {
    expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.user_id, userId))
      .orderBy(desc(expenseTable.date));
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
  }

  let sums: CategorySum[] = [];
  try {
    const currDate = new Date(2024, 7, 1);
    const columns = {
      category_id: categoryTable.id,
      month: sql`extract(month from ${expenseTable.date})`.mapWith(Number),
      year: sql`extract(year from ${expenseTable.date})`.mapWith(Number),
      total_cents: sum(sql`coalesce(${expenseTable.amount_cents}, 0)`).mapWith(
        Number
      ),
    };
    sums = await db
      .select(columns)
      .from(categoryTable)
      .leftJoin(expenseTable, and(eq(categoryTable.id, expenseTable.category_id)))
      .where(and(
        eq(categoryTable.user_id, userId),
        or(
          and(
            isNull(columns.month),
            isNull(columns.year),
            isNull(expenseTable.user_id)
          ),
          and(
            eq(columns.month, currDate.getMonth() + 1),
            eq(columns.year, currDate.getFullYear()),
            eq(expenseTable.user_id, userId)
          )
        )
      ))
      .groupBy(columns.category_id, columns.month, columns.year)
      .orderBy(desc(columns.total_cents));
  } catch (error) {
    console.error("Failed to fetch sums:", error);
  }

  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <NewExpenseButton className="absolute right-0 p-3 md:pt-0 md:pr-6" userId={userId} />
      <div className="overflow-hidden flex flex-col md:flex-row gap-8 pt-16 md:pb-6 md:pt-0 border-gray-300 max-w-7xl mx-auto">
        <MainSpendDisplay sums={sums} />
        <CategoryList sums={sums} />
      </div>
      <div className="w-full md:w-2/3 overflow-hidden px-6">
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}

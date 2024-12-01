"use server";

import { db } from "@/lib/db";
import { SelectExpense, dbExpenses } from "@/lib/db/schema";
import { moneyToCents } from "@/lib/money";
import { eq } from "drizzle-orm";

export async function createExpense(
  expense: ExpenseEdit,
  userId: string
): Promise<void> {
  await db.insert(dbExpenses).values({
    profile_id: userId,
    category_id: expense.category_id,
    name: expense.name,
    amount_cents: moneyToCents(expense.amount),
    date: new Date(expense.date),
  });
}

export async function getExpenses(userId: string): Promise<SelectExpense[]> {
  const expenses = await db.query.dbExpenses.findMany({
    where: eq(dbExpenses.profile_id, userId),
  });
  return expenses;
}

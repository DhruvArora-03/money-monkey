"use server";

import { db } from "@/lib/db";
import { expenseTable } from "@/lib/db/schema";
import { moneyToCents } from "@/lib/money";

export async function createExpense(
  expense: ExpenseEdit,
  userId: string
): Promise<void> {
  await db.insert(expenseTable).values({
    profile_id: userId,
    category_id: expense.category_id,
    name: expense.name,
    amount_cents: moneyToCents(expense.amount),
    date: new Date(expense.date),
  });
}

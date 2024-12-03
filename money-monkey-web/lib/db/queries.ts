"use server";

import { db } from "@/lib/db";
import { SelectCategory, SelectExpense, dbCategories, dbExpenses } from "@/lib/db/schema";
import { moneyToCents } from "@/lib/money";
import { and, eq } from "drizzle-orm";
import { createClient } from "../supabase/server";

export async function createExpense(
  expense: ExpenseEdit
): Promise<SelectExpense> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const insertedExpenses = await db
    .insert(dbExpenses)
    .values({
      profile_id: user.id,
      category_id: expense.category_id,
      name: expense.name,
      amount_cents: moneyToCents(expense.amount),
      date: new Date(expense.date),
    })
    .returning();
  return insertedExpenses[0];
}

export async function updateExpense(
  id: number,
  expense: ExpenseEdit
): Promise<SelectExpense> {
  const updatedExpenses = await db
    .update(dbExpenses)
    .set({
      category_id: expense.category_id,
      name: expense.name,
      amount_cents: moneyToCents(expense.amount),
      date: new Date(expense.date),
    })
    .where(and(eq(dbExpenses.id, id)))
    .returning();
  return updatedExpenses[0];
}

export async function getExpenses(userId: string): Promise<SelectExpense[]> {
  const expenses = await db.query.dbExpenses.findMany({
    where: eq(dbExpenses.profile_id, userId),
  });
  return expenses;
}

export async function getCategories(userId: string): Promise<SelectCategory[]> {
  const categories = await db.query.dbCategories.findMany({
    where: eq(dbCategories.profile_id, userId),
  });
  return categories;
}

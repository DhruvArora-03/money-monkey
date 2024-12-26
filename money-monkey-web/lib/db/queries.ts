"use server";

import { db } from "@/lib/db";
import { SelectCategory, SelectExpense, SelectPlaidAccount, dbCategories, dbExpenses, dbPlaidAccounts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { createClient } from "../supabase/server";

export async function getPlaidAccounts(userId: string): Promise<SelectPlaidAccount[]> {
  const accounts = await db.query.dbPlaidAccounts.findMany({
    where: eq(dbPlaidAccounts.profile_id, userId),
  });
  return accounts;
}

export async function createPlaidAccounts(accessToken: string, accounts: PlaidAccountResponse[]): Promise<SelectPlaidAccount[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const insertedAccounts = await db
    .insert(dbPlaidAccounts)
    .values(accounts.map(a => ({
      profile_id: user.id,
      account_id: a.id,
      access_token: accessToken,
      cursor: null,
      name: a.name,
      mask: a.mask,
      type: a.type,
    })))
    .returning();
  return insertedAccounts;
}

export async function getExpenses(userId: string): Promise<SelectExpense[]> {
  const expenses = await db.query.dbExpenses.findMany({
    where: eq(dbExpenses.profile_id, userId),
  });
  return expenses;
}

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
      category_id: expense.categoryId,
      name: expense.name,
      amount_cents: Math.round(expense.amount * 100),
      date: new Date(expense.date),
      is_income: expense.isIncome,
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
      category_id: expense.categoryId,
      name: expense.name,
      amount_cents: expense.amount * 100,
      date: new Date(expense.date),
    })
    .where(and(eq(dbExpenses.id, id)))
    .returning();
  return updatedExpenses[0];
}

export async function deleteExpense(id: number): Promise<void> {
  await db.delete(dbExpenses).where(eq(dbExpenses.id, id));
}

export async function getCategories(userId: string): Promise<SelectCategory[]> {
  const categories = await db.query.dbCategories.findMany({
    where: eq(dbCategories.profile_id, userId),
    orderBy: dbCategories.name
  });
  return categories;
}

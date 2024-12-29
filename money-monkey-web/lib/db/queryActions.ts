"use server";

import { db } from "@/lib/db";
import {
  InsertPlaidAccount,
  InsertPlaidTransaction,
  SelectCategory,
  SelectExpense,
  SelectPlaidAccount,
  SelectPlaidTransaction,
  dbCategories,
  dbExpenses,
  dbPlaidAccounts,
  dbPlaidTransactions,
} from "@/lib/db/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import { createClient } from "../supabase/server";

export async function getPlaidAccounts(
  userId: string
): Promise<SelectPlaidAccount[]> {
  const accounts = await db.query.dbPlaidAccounts.findMany({
    where: eq(dbPlaidAccounts.profile_id, userId),
    orderBy: dbPlaidAccounts.name,
  });
  return accounts;
}

export async function createPlaidAccounts(
  accounts: InsertPlaidAccount[]
): Promise<SelectPlaidAccount[]> {
  const insertedAccounts = await db
    .insert(dbPlaidAccounts)
    .values(accounts)
    .returning();
  return insertedAccounts;
}

export async function getPlaidTransactions(
  userId: string
): Promise<SelectPlaidTransaction[]> {
  const transactions = await db.query.dbPlaidTransactions.findMany({
    where: eq(dbPlaidTransactions.profile_id, userId),
    orderBy: dbPlaidTransactions.date, 
  });
  return transactions;
}

export async function syncPlaidTransactions(
  plaid_account_id: number,
  added: InsertPlaidTransaction[],
  modified: InsertPlaidTransaction[],
  removed: string[],
  new_cursor: string | null
): Promise<void> {
  console.log("syncing plaid transactions");
  console.log(added);
  console.log(modified);
  console.log(removed);

  db.transaction(async (tx) => {
    if (added.length > 0) {
      await tx.insert(dbPlaidTransactions).values(added);
    }

    for (const t of modified) {
      await tx
        .update(dbPlaidTransactions)
        .set(t)
        .where(
          and(
            eq(dbPlaidTransactions.transaction_id, t.transaction_id),
            eq(dbPlaidTransactions.plaid_account_id, plaid_account_id)
          )
        );
    }

    await tx
      .delete(dbPlaidTransactions)
      .where(
        and(
          eq(dbPlaidTransactions.plaid_account_id, plaid_account_id),
          inArray(dbPlaidTransactions.transaction_id, removed)
        )
      );

    await tx
      .update(dbPlaidAccounts)
      .set({ cursor: new_cursor })
      .where(eq(dbPlaidAccounts.id, plaid_account_id));
  });
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
    orderBy: dbCategories.name,
  });
  return categories;
}

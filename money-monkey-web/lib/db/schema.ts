import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgPolicy,
  pgSchema,
  pgTableCreator,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// edit this to create a table_prefix
const createTable = pgTableCreator((name) => `${name}`);

const getCreatedAtColumn = () =>
  timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow();
const getUpdatedAtColumn = () =>
  timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date());

const authSchema = pgSchema("auth");

const usersTable = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profiles = createTable(
  "profiles",
  {
    // Matches id from auth.users table in Supabase
    id: uuid("id")
      .primaryKey()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  () => [
    pgPolicy("Users can view their own profile", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`(select auth.uid()) = id`,
    }),
  ]
);

export const dbPlaidAccounts = createTable(
  "plaid_accounts",
  {
    id: serial("id").primaryKey(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    account_id: text("account_id").notNull(),
    access_token: text("access_token").notNull(),
    cursor: text("cursor"),
    name: text("name").notNull(),
    mask: text("mask"),
    type: text("type").notNull(),
    created_at: getCreatedAtColumn(),
    updated_at: getUpdatedAtColumn(),
  },
  () => [
    pgPolicy("Users can do anything with their own plaid accounts", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(select auth.uid()) = profile_id`,
    }),
  ]
);

export const dbPlaidTransactions = createTable(
  "plaid_transactions",
  {
    id: serial("id").primaryKey(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    plaid_account_id: integer("plaid_account_id")
      .notNull()
      .references(() => dbPlaidAccounts.id),
    name: text("name").notNull(),
    amount_cents: integer("amount_cents").notNull(),
    date: date("date", { mode: "date" }).notNull(),
    suggested_category: text("suggested_category"),
    created_at: getCreatedAtColumn(),
    updated_at: getUpdatedAtColumn(),
  },
  () => [
    pgPolicy("Users can do anything with their own plaid transactions", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(select auth.uid()) = profile_id`,
    }),
  ]
);

export const dbExpenses = createTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    category_id: integer("category_id")
      .references(() => dbCategories.id),
    is_income: boolean("is_income").notNull().default(false),
    name: text("name").notNull(),
    amount_cents: integer("amount_cents").notNull(),
    date: date("date", { mode: "date" }).notNull(),
    created_at: getCreatedAtColumn(),
    updated_at: getUpdatedAtColumn(),
  },
  () => [
    pgPolicy("Users can do anything with their own expenses", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(select auth.uid()) = profile_id`,
    }),
  ]
);

export const dbCategories = createTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color")
      .notNull()
      .default(sql`(random_hex_color())`),
    created_at: getCreatedAtColumn(),
    updated_at: getUpdatedAtColumn(),
  },
  (t) => [
    uniqueIndex("user_category_idx").on(t.profile_id, t.name),
    pgPolicy("Users can do anything with their own categories", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(select auth.uid()) = profile_id`,
    }),
  ]
);

export const defaultCategories = pgEnum("default_categories", [
  "Other",
  "Housing",
  "Groceries",
  "Food",
  "Transportation",
  "Entertainment",
  "Necessities",
  "Clothes",
]);

export type InsertPlaidAccount = typeof dbPlaidAccounts.$inferInsert;
export type SelectPlaidAccount = typeof dbPlaidAccounts.$inferSelect;

export type InsertPlaidTransaction = typeof dbPlaidTransactions.$inferInsert;
export type SelectPlaidTransaction = typeof dbPlaidTransactions.$inferSelect;

export type InsertExpense = typeof dbExpenses.$inferInsert;
export type SelectExpense = typeof dbExpenses.$inferSelect;

export type InsertCategory = typeof dbCategories.$inferInsert;
export type SelectCategory = typeof dbCategories.$inferSelect;

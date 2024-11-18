import { sql } from "drizzle-orm";
import {
  date,
  integer,
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

const getCreatedAtColumn = () => timestamp("created_at").defaultNow().notNull();
const getUpdatedAtColumn = () =>
  timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`)
    .notNull();

const authSchema = pgSchema("auth");

const usersTable = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profileTable = createTable(
  "profile",
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

export const expenseTable = createTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profileTable.id),
    category_id: integer("category_id")
      .references(() => categoryTable.id)
      .notNull(),
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

export const categoryTable = createTable(
  "category",
  {
    id: serial("id").primaryKey(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profileTable.id),
    name: text("name").notNull(),
    color: text("color").notNull(),
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

export type InsertExpense = typeof expenseTable.$inferInsert;
export type SelectExpense = typeof expenseTable.$inferSelect;
export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;

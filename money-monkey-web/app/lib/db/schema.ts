import { sql } from "drizzle-orm";
import {
  date,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `money_monkey_${name}`);

const getCreatedAtColumn = () => timestamp("created_at").defaultNow().notNull();
const getUpdatedAtColumn = () =>
  timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`)
    .notNull();

export const expenseTable = createTable("expense", {
  user_id: text("user_id").notNull(),

  id: serial("id").primaryKey(),
  category_id: integer("category_id")
    .references(() => categoryTable.id)
    .notNull(),

  name: text("name").notNull(),
  amount_cents: integer("amount_cents").notNull(),
  date: date("date", { mode: "date" }).notNull(),

  created_at: getCreatedAtColumn(),
  updated_at: getUpdatedAtColumn(),
});

export const categoryTable = createTable(
  "category",
  {
    user_id: text("user_id").notNull(),

    id: serial("id").primaryKey(),

    name: text("name").notNull(),
    color: text("color").notNull(),

    created_at: getCreatedAtColumn(),
    updated_at: getUpdatedAtColumn(),
  },
  (table) => {
    return {
      userCategoryIdx: uniqueIndex("user_category_idx").on(
        table.user_id,
        table.name
      ),
    };
  }
);

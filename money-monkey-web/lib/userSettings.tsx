"use client";

import { createContext, useMemo, useState } from "react";
import { SelectCategory, SelectExpense } from "@/lib/db/schema";
interface UserSettings {
  categories: Map<number, SelectCategory>;
  addCategory: (category: SelectCategory) => void;
  expenses: SelectExpense[];
  addExpense: (expense: SelectExpense) => void;
}
export const UserSettingsContext = createContext<UserSettings>({
  categories: new Map(),
  addCategory: () => {},
  expenses: [],
  addExpense: () => {},
});

export default function UserSettingsProvider(props: {
  children: React.ReactNode;
  categories: SelectCategory[];
  expenses: SelectExpense[];
}) {
  const [categories, setCategories] = useState(props.categories);
  const [expenses, setExpenses] = useState(props.expenses);

  return (
    <UserSettingsContext.Provider
      value={{
        categories: new Map(categories.map((c) => [c.id, c])),
        addCategory: (category: SelectCategory) => {
          setCategories([...categories, category]);
        },
        expenses: expenses,
        addExpense: (expense: SelectExpense) => {
          setExpenses([...expenses, expense]);
        },
      }}
    >
      {props.children}
    </UserSettingsContext.Provider>
  );
}

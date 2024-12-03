"use client";

import { createContext, useMemo, useState } from "react";
import { SelectCategory, SelectExpense } from "@/lib/db/schema";
interface UserSettings {
  categories: SelectCategory[];
  addCategory: (category: SelectCategory) => void;
  expenses: SelectExpense[];
  addExpense: (expense: SelectExpense) => void;
  setExpense: (id: number, expense: SelectExpense) => void;
}
export const UserSettingsContext = createContext<UserSettings>({
  categories: [],
  addCategory: () => {},
  expenses: [],
  addExpense: () => {},
  setExpense: () => {},
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
        categories: categories,
        addCategory: (category: SelectCategory) => {
          setCategories([...categories, category]);
        },
        expenses: expenses,
        addExpense: (expense: SelectExpense) => {
          setExpenses([...expenses, expense]);
        },
        setExpense: (id: number, expense: SelectExpense) => {
          setExpenses(
            expenses.map((e) => {
              if (e.id === id) {
                return expense;
              }
              return e;
            })
          );
        },
      }}
    >
      {props.children}
    </UserSettingsContext.Provider>
  );
}

import React from 'react';
import ExpenseItem from "@ui/ExpenseItem";
import { getExpenses } from '@lib/api';

export default async function ExpenseList() {
  return getExpenses()
    .then((expenses) => (
      <div>
        {expenses.map((e) => <ExpenseItem key={e.id} expense={e} />)}
      </div>
    ))
    .catch((err) => (
        <div>Could not fetch expenses: {err.message}</div>
    ));
};
import React from 'react';

type ExpenseProps = {
  expense: Expense;
}

export default function ExpenseItem({ expense: { name, date, amount_cents, category_name }}: ExpenseProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{date}</p>
      <p>{amount_cents / 100}</p>
      <p>{category_name}</p>
    </div>
  );
};
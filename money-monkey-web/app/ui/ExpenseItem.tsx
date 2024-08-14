import { formatMoney } from '@lib/money';
import React from 'react';

type ExpenseProps = {
  expense: Expense;
}

export default function ExpenseItem({ expense: { name, date, amount_cents, category_name } }: ExpenseProps) {
  return (
    <tr className='border-y-2 [&:has(div +)]:border-t-4'>
      <td>{name}</td>
      <td>{`${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`}</td>
      <td>{formatMoney(amount_cents)}</td>
      <td>{category_name}</td>
    </tr>
  );
};

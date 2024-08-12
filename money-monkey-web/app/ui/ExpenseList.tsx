import React from 'react';
import ExpenseItem from "@ui/ExpenseItem";
import { getExpenses } from '@lib/api';

export default async function ExpenseList() {
  try {
    const expenses = await getExpenses()
    var monthlyExpenses = Array.from(
      Map.groupBy(expenses, ({date}) => date.toLocaleDateString("en-US", {month: "long", year: "numeric"}))
    )
  }
  catch {
    return <div>Could not fetch expenses</div>
  } 


  return (
      <table className='w-full'>
        <>
          {monthlyExpenses.map(([monthYear, expenses]) => (
            <>
              <tr className='w-full text-xl'>{monthYear}</tr>
              {expenses.map((e) => <ExpenseItem key={e.id} expense={e} />)}
            </>
          ))}
        </>
      </table>
    );
};
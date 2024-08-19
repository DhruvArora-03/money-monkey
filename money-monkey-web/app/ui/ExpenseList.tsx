import React from "react";
import { getExpenses } from "@lib/api";
import { formatMoney } from "@lib/money";

export default async function ExpenseList() {
  try {
    var expenses = await getExpenses();
  } catch {
    return <div>Could not fetch expenses</div>;
  }

  var prevKey = "";
  return (
  <table className="w-full">
    {expenses.map((e) => {
      const key = e.date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC"
      });

      return (
        <React.Fragment key={key}>
          {key != prevKey && (
            <tr className="w-full pt-5 [&:first-child]:pt-0 border-b-4 whitespace-nowrap text-xl">
              {prevKey = key}
            </tr>
          )}
          <tr key={e.id} className='border-y-2'>
            <td>{e.name}</td>
            <td>{`${e.date.getUTCMonth() + 1}/${e.date.getUTCDate()}/${e.date.getUTCFullYear()}`}</td>
            <td>{formatMoney(e.amount_cents)}</td>
            <td>{e.category_name}</td>
          </tr>
        </React.Fragment>
      );
    })}
    </table>
  );
}

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
    <table className="group w-full table-fixed">
      <tbody>
        {expenses.map((e) => {
        const key = e.date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
          timeZone: "UTC"
        });

        return (
          <React.Fragment key={key}>
            {key != prevKey && (
              <tr className="border-b-4 text-xl">
                <td className="pt-5">{prevKey = key}</td>
              </tr>
            )}
            <tr key={e.id} className='border-y-2'>
              <td className="text-nowrap text-ellipsis overflow-hidden">{e.name}</td>
              <td>{`${e.date.getUTCMonth() + 1}/${e.date.getUTCDate()}/${e.date.getUTCFullYear()}`}</td>
              <td>{formatMoney(e.amount_cents)}</td>
              <td>{e.category_name}</td>
            </tr>
          </React.Fragment>
        );
      })}
      </tbody>
    </table>
  );
}

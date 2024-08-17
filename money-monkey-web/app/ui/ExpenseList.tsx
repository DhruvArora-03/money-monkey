import React from "react";
import ExpenseItem from "@ui/ExpenseItem";
import { getExpenses } from "@lib/api";

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
      });

      return (
        <React.Fragment key={key}>
          {key != prevKey && (
            <div className="w-full pt-5 [&:first-child]:pt-0 border-b-4 whitespace-nowrap text-xl">
              {(prevKey = key)}
            </div>
          )}
          <ExpenseItem key={e.id} expense={e} />
        </React.Fragment>
      );
    })}
    </table>
  );
}

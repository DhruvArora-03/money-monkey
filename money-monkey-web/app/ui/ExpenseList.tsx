import React from "react";
import { getExpenses } from "@lib/api";
import { formatMoney } from "@lib/money";

interface ExpenseMonth {
  monthYear: string;
  dates: ExpenseDate[];
}

interface ExpenseDate {
  date: string;
  expenses: Expense[];
}

export default async function ExpenseList() {
  try {
    var expenses = await getExpenses();
  } catch {
    return <>Could not fetch expenses</>;
  }

  var expenseMonths: ExpenseMonth[] = [];
  expenses.forEach((e) => {
    const monthYear = e.date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    const date = e.date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });

    // check if belongs in current running month
    var currMonth = expenseMonths.at(-1);
    if (!currMonth || currMonth.monthYear != monthYear) {
      // if not, create a new month
      currMonth = {
        monthYear: monthYear,
        dates: [],
      };
      expenseMonths.push(currMonth);
    }

    // check if belongs in current running date
    var currDate = currMonth.dates.at(-1);
    if (!currDate || currDate.date != date) {
      currDate = {
        date: date,
        expenses: [],
      };
      currMonth.dates.push(currDate);
    }

    currDate.expenses.push(e);
  });

  var lastDate = null;
  return (
    <table className="w-full">
      <tbody>
        {expenseMonths.length == 0 ? (
          <tr>
            <td>No expenses yet!</td>
          </tr>
        ) : (
          expenseMonths.map((m) => (
            <React.Fragment key={m.monthYear}>
              <tr className="w-full border-b-4 text-xl pt-5 text-nowrap">
                <td colSpan={3}>{m.monthYear}</td>
              </tr>
              {m.dates.map((d) => (
                <React.Fragment key={d.date}>
                  {d.expenses.map((e, index) => (
                    <tr
                      key={e.id}
                      className="text-md hover:bg-blue-100"
                    >
                      <td className="text-lg w-0 pr-2">{index == 0 ? d.date : ""}</td>
                      <td className="max-w-0 text-nowrap text-ellipsis overflow-hidden">
                        <span className="text-sm text-gray-600">
                          {e.category_name}
                        </span>
                        <span className="invisible md:visible">
                          {` - `}
                        </span>
                        <br className="md:hidden" />
                        {e.name.trim()}
                      </td>
                      <td className="text-right w-0 pl-2">{formatMoney(e.amount_cents)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
  );
}

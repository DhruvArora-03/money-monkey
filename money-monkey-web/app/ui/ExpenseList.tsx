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
              <tr className="border-b-4 text-xl">
                <td className="pt-5 text-nowrap">{m.monthYear}</td>
              </tr>
              {m.dates.map((d) => (
                <div key={d.date} className="grid grid-cols-[75px_1fr] my-2">
                  <p className="text-lg text-nowrap">{d.date}</p>
                  <div>
                    {d.expenses.map((e) => (
                      <tr
                        key={e.id}
                        className="text-md [&>*]:px-4 hover:bg-blue-100"
                      >
                        <td className="text-nowrap text-ellipsis overflow-hidden w-[20ch] md:w-[36ch] lg:w-[44ch]">
                          {e.name.trim()}
                          <span className="text-sm text-gray-700">
                            {` - ${e.category_name}`}
                          </span>
                        </td>
                        <td>{formatMoney(e.amount_cents)}</td>
                      </tr>
                    ))}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
  );
}

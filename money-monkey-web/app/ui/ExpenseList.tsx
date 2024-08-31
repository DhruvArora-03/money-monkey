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
    return <div>Could not fetch expenses</div>;
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

    var currMonth = expenseMonths.at(-1);
    if (!currMonth || currMonth.monthYear != monthYear) {
      currMonth = {
        monthYear: monthYear,
        dates: [],
      };
      expenseMonths.push(currMonth);
    }

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
        {expenseMonths.map((m) => (
          <React.Fragment key={m.monthYear}>
            <tr className="border-b-4 text-xl">
              <td className="pt-5 text-nowrap">{m.monthYear}</td>
            </tr>
            {m.dates.map((d) => (
              <React.Fragment key={d.date}>
                <tr className="text-lg">
                  <td className="pt-2 text-nowrap">{d.date}</td>
                </tr>
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
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

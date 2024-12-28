"use client";

import React, { useContext, useMemo, useState } from "react";
import EditExpenseModal from "@/components/EditExpenseModal";
import { UserSettingsContext } from "@/lib/userSettings";
import { formatMoney } from "@/lib/money";
import { SelectExpense } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface ExpenseMonth {
  monthYear: string;
  dates: ExpenseDate[];
}

interface ExpenseDate {
  date: string;
  expenses: SelectExpense[];
}

const monthYearDateOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
};

const dateOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
  weekday: "long",
};

export default function ExpenseList() {
  const { categories, expenses } = useContext(UserSettingsContext);
  const [selectedExpense, setSelectedExpense] = useState<SelectExpense | null>(
    null
  );

  expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
  const expenseMonths: ExpenseMonth[] = useMemo(() => {
    const months: ExpenseMonth[] = [];
    for (const e of expenses) {
      const monthYear = e.date.toLocaleDateString(
        "en-US",
        monthYearDateOptions
      );
      const date = e.date.toLocaleDateString("en-US", dateOptions);

      // check if belongs in current running month --> if not, create a new month
      let currMonth = months.at(-1);
      if (!currMonth || currMonth.monthYear != monthYear) {
        currMonth = {
          monthYear: monthYear,
          dates: [],
        };
        months.push(currMonth);
      }

      // check if belongs in current running date --> if not, create a new date
      let currDate = currMonth.dates.at(-1);
      if (!currDate || currDate.date != date) {
        currDate = {
          date: date,
          expenses: [],
        };
        currMonth.dates.push(currDate);
      }

      currDate.expenses.push(e);
    }
    return months;
  }, [expenses]);

  return (
    <>
      <EditExpenseModal
        initialExpense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
      <table className="w-full">
        <tbody>
          {expenseMonths.length == 0 ? (
            <tr>
              <td>No expenses yet!</td>
            </tr>
          ) : (
            expenseMonths.map((m) => (
              <React.Fragment key={m.monthYear}>
                <tr className="w-full border-b-4 text-xl text-nowrap">
                  <td colSpan={3} className="pt-5">
                    {m.monthYear}
                  </td>
                </tr>
                {m.dates.map((d) => (
                  <React.Fragment key={d.date}>
                    <tr>
                      <td className="text-sm pt-3 text-gray-600">{d.date}</td>
                    </tr>
                    {d.expenses.map((e) => (
                      <tr
                        key={e.id}
                        className="hover:bg-blue-100"
                        onClick={() => setSelectedExpense(e)}
                      >
                        <td className="text-sm pl-0">{e.name}</td>
                        <td className="w-0 text-xs  text-gray-600">
                          {categories.find((c) => c.id == e.category_id)?.name}
                        </td>
                        <td
                          className={cn(
                            "text-right w-0 pl-2 text-sm",
                            e.is_income ? "text-green-600" : "text-red-700"
                          )}
                        >
                          {formatMoney(e.amount_cents / 100)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

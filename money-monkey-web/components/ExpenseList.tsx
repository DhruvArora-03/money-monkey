"use client";

import React, { useContext, useMemo, useState } from "react";
import EditExpenseModal from "@/components/EditExpenseModal";
import { UserSettingsContext } from "@/lib/userSettings";
import { usdFormatter } from "@/lib/money";
import { SelectExpense } from "@/lib/db/schema";

interface ExpenseListProps {
  expenses: SelectExpense[];
}

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
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
};

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const { categories } = useContext(UserSettingsContext);
  const [selectedExpense, setSelectedExpense] = useState<SelectExpense | null>(
    null
  );

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
                    {d.expenses.map((e, index) => (
                      <tr
                        key={e.id}
                        className="text-md hover:bg-blue-100"
                        onClick={() => setSelectedExpense(e)}
                      >
                        <td className="text-lg w-0 pr-3">
                          {index == 0 ? d.date : ""}
                        </td>
                        <td className="text-nowrap text-ellipsis overflow-hidden py-1">
                          <span className="text-sm text-gray-600 hidden md:inline">
                            {`${categories.get(e.category_id)?.name} - `}
                          </span>
                          {e.name.trim()}
                          <br className="md:hidden" />
                          <span className="text-sm text-gray-600 md:hidden">
                            {categories.get(e.category_id)?.name}
                          </span>
                        </td>
                        <td className="text-right w-0 pl-2">
                          {usdFormatter.format(e.amount_cents / 100)}
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

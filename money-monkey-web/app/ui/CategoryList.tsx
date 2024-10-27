"use client";

import React, { useContext } from "react";
import { formatMoney } from "@lib/money";
import { UserSettingsContext } from "@lib/userSettings";

export default function CategoryList({ sums }: { sums: CategorySum[] }) {
  var { categories } = useContext(UserSettingsContext);

  return (
    <div className="w-full flex flex-col gap-1">
      {sums.map((sum) => {
        var cat = categories.get(sum.category_id);
        if (!cat) {
          return <></>;
        }

        return (
          <div
            key={sum.category_id}
            className="flex justify-between p-1 hover:bg-blue-100"
          >
            <div className="flex items-center gap-2">
              <div
                className="rounded-full w-4 h-4 border-2"
                style={
                  sum.total_cents > 0
                    ? { backgroundColor: cat.color }
                    : { border: "none" }
                }
              />
              <p>{cat.name}</p>
            </div>
            <p>{formatMoney(sum.total_cents)}</p>
          </div>
        );
      })}
    </div>
  );
}

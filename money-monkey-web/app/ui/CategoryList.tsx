import React from "react";
import { formatMoney } from "@lib/money";

export default async function CategoryList({sums} : {sums: CategorySum[]}) {
  return (
  <div className="w-full">
    {sums.map((sum) => (
      <div key={sum.category_id} className="flex flex-row justify-between">
        <p>{sum.name}</p>
        <p>{formatMoney(sum.total_cents)}</p>
      </div>
    ))}
  </div>
  );
}

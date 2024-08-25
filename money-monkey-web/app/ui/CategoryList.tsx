import React from "react";
import { formatMoney } from "@lib/money";

export default async function CategoryList({sums} : {sums: CategorySum[]}) {
  return (
  <div className="w-full flex flex-col gap-1">
    {sums.map((sum) => (
      <div key={sum.category_id} className={`flex justify-between border-2 bg-white rounded-md p-1 hover:bg-blue-100`} style={{borderColor: sum.color}}>
        <p>{sum.name}</p>
        <p>{formatMoney(sum.total_cents)}</p>
      </div>
    ))}
  </div>
  );
}

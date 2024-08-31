import React from "react";
import { formatMoney } from "@lib/money";

export default async function CategoryList({ sums }: { sums: CategorySum[] }) {
  return (
    <div className="w-full flex flex-col gap-1">
      {sums.map((sum) => (
        <div key={sum.category_id} className="flex justify-between p-1 hover:bg-blue-100">
          <div className="flex items-center gap-2">
            <div className="rounded-full w-4 h-4 border-2" style={sum.total_cents > 0 ? { backgroundColor: sum.color } : {border: "none"}} />
            <p>{sum.name}</p>
          </div>
          <p>{formatMoney(sum.total_cents)}</p>
        </div>
      ))}
    </div>
  );
}

"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatMoney } from "@/lib/money";
import { useContext } from "react";
import { UserSettingsContext } from "@/lib/userSettings";

export function CategoryPieChart({ sums }: { sums: CategorySum[] }) {
  const { categories } = useContext(UserSettingsContext);

  const total = React.useMemo(
    () =>
      sums.reduce(
        (x, y) => ({ ...x, total_cents: x.total_cents + y.total_cents }),
        {
          category_id: 0,
          total_cents: 0,
        } satisfies CategorySum
      ).total_cents,
    [sums]
  );
  const chartData = sums.map(({ category_id, total_cents }) => {
    const cat = categories.get(category_id);
    if (!cat || total_cents == 0) {
      return null;
    }

    return {
      amount: total_cents / 100,
      name: cat.name,
      fill: `var(--color-${cat.name}`,
      // fill: cat.color,
    };
  });
  // .filter((x) => x);

  const chartConfig: ChartConfig = sums
    .map(({ category_id }) => {
      const cat = categories.get(category_id);
      if (!cat) {
        return null;
      }
      return {
        label: cat.name,
        color: cat.color,
      };
    })
    .reduce((acc, val) => ({ ...acc, [val!.label]: val }), {});

  return (
    <div className="w-[500px] h-full">
      <ChartContainer config={chartConfig} className="aspect-square w-full">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="name"
            innerRadius={80}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {formatMoney(total)}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

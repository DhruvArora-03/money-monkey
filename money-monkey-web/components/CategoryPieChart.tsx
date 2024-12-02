"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatMoney } from "@/lib/money";
import { UserSettingsContext } from "@/lib/userSettings";
import { useContext, useMemo } from "react";
import { cn } from "@/lib/utils";

export function CategoryPieChart({ className }: { className: string }) {
  const { categories, expenses } = useContext(UserSettingsContext);
  const currDate = new Date();
  const currExpensesByCategoryId = Object.groupBy(
    expenses.filter((e) => e.date.getMonth() === currDate.getMonth()),
    ({ category_id }) => category_id
  );
  const sums: CategorySum[] = Array.from(
    categories.map(
      (c) =>
        ({
          category_id: c.id,
          total_cents:
            currExpensesByCategoryId[c.id]?.reduce(
              (acc, e) => acc + e.amount_cents,
              0
            ) ?? 0,
        } satisfies CategorySum)
    )
  ).sort((a, b) => b.total_cents - a.total_cents);

  const total = useMemo(
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
  const [chartData, chartConfig] = useMemo(() => {
    const data = [];
    const config = [];

    for (const sum of sums) {
      const cat = categories.find((c) => c.id == sum.category_id);
      if (!cat || sum.total_cents == 0) {
        continue;
      }

      data.push({
        amount: sum.total_cents,
        name: cat.name,
        fill: `var(--color-${cat.name}`,
      });
      config.push({
        key: cat.name,
        label: (
          <div className="flex w-full justify-between">
            <p>{cat.name}</p>
            <p>{formatMoney(sum.total_cents)}</p>
          </div>
        ),
        color: cat.color,
      });
    }

    return [
      data,
      config.reduce(
        (acc, val) => ({ ...acc, [val!.key]: val }),
        {}
      ) satisfies ChartConfig,
    ];
  }, [sums, categories]);

  return (
    <Card className={cn("max-w-xl w-full h-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl">Expenses by Category</CardTitle>
        <CardDescription>hi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-square w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  valueFormatter={(x) => {
                    if (typeof x === "string" || typeof x === "number") {
                      return formatMoney(x);
                    }
                    return x.join("\n");
                  }}
                  nameKey="key"
                />
              }
            />
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
            <ChartLegend className="" content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

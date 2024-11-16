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

export function CategoryPieChart({ sums }: { sums: CategorySum[] }) {
  const { categories } = useContext(UserSettingsContext);

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
      const cat = categories.get(sum.category_id);
      if (!cat || sum.total_cents == 0) {
        continue;
      }

      data.push({
        amount: sum.total_cents / 100,
        name: cat.name,
        fill: `var(--color-${cat.name}`,
      });
      config.push({
        label: cat.name,
        color: cat.color,
      });
    }

    return [
      data,
      config.reduce(
        (acc, val) => ({ ...acc, [val!.label]: val }),
        {}
      ) satisfies ChartConfig,
    ];
  }, [sums, categories]);

  return (
    <div className="w-[500px] h-full">
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>
            Showing total visitors for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-square w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelKey="label" />}
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
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

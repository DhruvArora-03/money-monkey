import { useMemo } from "react";
import colors from "@/app/lib/colors";
import { formatMoney } from "@/app/lib/money";
import { ExpenseTypes, HomePageStats } from "@/app/lib/types";

const MIN_THRESHOLD = 0.05;

type CircleSection = {
  type: ExpenseTypes;
  percentage: number;
};

type MainSpendDisplayProps = {
  stats: HomePageStats | undefined;
  radius: number;
};

export default function MainSpendDisplay({
  radius: r,
  stats,
}: MainSpendDisplayProps) {
  const pad = 10;
  const dim = (pad + r) * 2;

  const values = useMemo(
    () =>
      ExpenseTypes.map((type) => {
        const val = stats ? stats.catagories[type] : 0;
        return {
          type,
          value:
            stats && val > 0 && val / stats.totalCents < MIN_THRESHOLD
              ? MIN_THRESHOLD * stats.totalCents
              : val,
        };
      }).filter((x) => x.value > 0),
    [stats],
  );
  const total = useMemo(
    () =>
      values.reduce((x, y) => ({ ...x, value: x.value + y.value }), {
        type: "",
        value: 0,
      }).value,
    [values],
  );
  const sections: CircleSection[] = useMemo(
    () =>
      values.map(
        ({ type, value }) =>
          ({
            type,
            percentage: value / total,
          }) satisfies CircleSection,
      ),
    [values, total],
  );

  if (stats == undefined) {
    return (
      <svg className="w-full h-[300px]" width={dim} height={dim}>
        <circle
          stroke="black"
          strokeWidth={4}
          fill="none"
          cx={pad + r}
          cy={pad + r}
          r={r}
        />
        <text
          x={dim / 2}
          y={dim / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={36}
          fontWeight={600}
          fill="black"
        >
          ...
        </text>
      </svg>
    );
  }

  function Section({ percentage: p, type, i }: CircleSection & { i: number }) {
    if (p === 0) {
      return null;
    }

    const prev =
      sections
        .slice(0, i)
        .map(({ percentage }) => percentage)
        .reduce((x, y) => x + y, 0) + 0.75;

    if (p === 1) {
      return (
        <circle
          cx={pad + r}
          cy={pad + r}
          r={r}
          stroke={colors.expenses[type]}
          strokeWidth={20}
          fill="none"
        />
      );
    }

    // magic number for spacing between
    const start = (prev + 0.022) * (2 * Math.PI);
    const end = (prev + p) * (2 * Math.PI);

    return (
      <path
        d={`M ${pad + r + r * Math.cos(start)} ${pad + r + r * Math.sin(start)}
            A ${r} ${r} 0 ${p > 0.51 ? 1 : 0} 1 ${pad + r + r * Math.cos(end)} ${pad + r + r * Math.sin(end)}`}
        stroke={colors.expenses[type]}
        strokeWidth={15}
        strokeLinecap="round"
        fill="none"
      />
    );
  }

  return (
    <view className="w-full, height-[300px]">
      <svg width={"100%"} height={"100%"} viewBox={`0 0 ${dim} ${dim}`}>
        <text
          x={dim / 2}
          y={dim / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={36}
          fontWeight={600}
          fill="black"
        >
          {formatMoney(stats.totalCents)}
        </text>
        {sections
          .sort((a, b) => b.percentage - a.percentage)
          .map((s: CircleSection, i) => (
            <Section key={s.type} i={i} {...s} />
          ))}
      </svg>
    </view>
  );
}

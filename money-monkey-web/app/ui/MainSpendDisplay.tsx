"use client";

import { formatMoney } from "@lib/money";
import { UserSettingsContext } from "@lib/userSettings";
import { useContext } from "react";

type CircleSection = {
  category_id: number;
  percentage: number;
  color: string;
};

export default function MainSpendDisplay({ sums }: { sums: CategorySum[] }) {
  const { categories } = useContext(UserSettingsContext);

  const width = 450;
  const r = (width - 70 - 30) / 2;

  const pad = 10;
  const offset = pad + r;
  const dim = offset * 2;

  const total = sums.reduce(
    (x, y) => ({ ...x, total_cents: x.total_cents + y.total_cents }),
    {
      category_id: 0,
      total_cents: 0,
    } satisfies CategorySum
  ).total_cents;
  const sections: CircleSection[] = sums
    .filter((s) => s.total_cents != 0)
    .map(
      ({ category_id, total_cents }) =>
        ({
          category_id: category_id,
          color: categories.get(category_id)?.color ?? "#0FF0AF",
          percentage: total_cents / total,
        } satisfies CircleSection)
    );

  if (sums == undefined || total == 0) {
    return (
      <svg
        className="height-[300px]"
        width={"100%"}
        height={"100%"}
        viewBox={`0 0 ${dim} ${dim}`}
      >
        <circle
          stroke="black"
          strokeWidth={4}
          fill="none"
          cx={offset}
          cy={offset}
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
          {formatMoney(0)}
        </text>
      </svg>
    );
  }

  function Section({ percentage: p, color, i }: CircleSection & { i: number }) {
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
          cx={offset}
          cy={offset}
          r={r}
          stroke={color}
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
        d={`M ${offset + r * Math.cos(start)} ${offset + r * Math.sin(start)}
            A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${offset + r * Math.cos(end)} ${
          offset + r * Math.sin(end)
        }`}
        stroke={color}
        strokeWidth={15}
        strokeLinecap="round"
        fill="none"
      />
    );
  }

  return (
    <svg
      className="w-full height-[300px] px-16 md:px-0"
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 ${dim} ${dim}`}
    >
      <text
        x={dim / 2}
        y={dim / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={36}
        fontWeight={600}
        fill="black"
      >
        {formatMoney(total)}
      </text>
      {sections
        .sort((a, b) => b.percentage - a.percentage)
        .map((s: CircleSection, i) => (
          <Section key={s.category_id} i={i} {...s} />
        ))}
    </svg>
  );
}

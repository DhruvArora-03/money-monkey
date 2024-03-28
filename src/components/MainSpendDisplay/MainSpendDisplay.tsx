import { useMemo } from 'react'
import { expenseColors } from 'src/lib/colors'
import { formatMoney } from 'src/lib/money'
import { ExpenseTypes, HomePageStats } from 'src/lib/types'

const MIN_THRESHOLD = 0.02

type CircleSection = {
  color: (typeof expenseColors)[ExpenseTypes]
  percentage: number
}

type MainSpendDisplayProps = {
  totalDisplayClassName?: string
  stats: HomePageStats | undefined
  radius: number
}

export default function MainSpendDisplay({
  radius: r,
  ...props
}: MainSpendDisplayProps) {
  const pad = 10
  const dim = (pad + r) * 2

  const values = useMemo(
    () =>
      ExpenseTypes.map((type) => {
        const val = props.stats ? props.stats.catagories[type] : 0
        return {
          color: expenseColors[type as ExpenseTypes],
          value:
            props.stats &&
            val > 0 &&
            val / props.stats.totalCents < MIN_THRESHOLD
              ? MIN_THRESHOLD * props.stats.totalCents
              : val,
        }
      }).filter((x) => x.value > 0),
    [props.stats],
  )
  const total = useMemo(
    () =>
      values.reduce((x, y) => ({ ...x, value: x.value + y.value }), {
        color: '',
        value: 0,
      }).value,
    [values],
  )
  const sections: CircleSection[] = useMemo(
    () =>
      values.map(
        ({ color, value }) =>
          ({
            color: color,
            percentage: value / total,
          }) as CircleSection,
      ),
    [values, total],
  )

  if (props.stats == undefined) {
    return (
      <svg width={dim} height={dim}>
        <circle
          stroke="white"
          strokeWidth={4}
          fill="none"
          cx={pad + r}
          cy={pad + r}
          r={r}
        />
        <text
          x={dim / 2}
          y={dim / 2}
          dominantBaseline="central"
          textAnchor="middle"
          className={props.totalDisplayClassName}
          fill="white"
        >
          ...
        </text>
      </svg>
    )
  }

  function Section({ percentage: p, color, i }: CircleSection & { i: number }) {
    if (p === 0) {
      return <></>
    }

    const prev = sections
      .slice(0, i)
      .map(({ percentage: pp }) => pp)
      .reduce((x, y) => x + y, 0)

    if (p === 1) {
      return (
        <circle
          cx={pad + r}
          cy={pad + r}
          r={r}
          stroke={color}
          strokeWidth={4}
          fill="none"
        />
      )
    }

    const start = (prev + 0.008) * (2 * Math.PI)
    const end = (prev + p) * (2 * Math.PI)

    return (
      <path
        d={`M ${pad + r + r * Math.cos(start)} ${pad + r + r * Math.sin(start)}
            A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1
            ${pad + r + r * Math.cos(end)}
            ${pad + r + r * Math.sin(end)}
            `}
        stroke={color}
        strokeWidth={4}
        fill="none"
      />
    )
  }

  return (
    <svg width={dim} height={dim}>
      <text
        x={dim / 2}
        y={dim / 2}
        dominantBaseline="central"
        textAnchor="middle"
        className={props.totalDisplayClassName}
        fill="white"
      >
        {formatMoney(props.stats.totalCents)}
      </text>
      {sections.map((s: CircleSection, i) => (
        <Section key={s.color} i={i} {...s} />
      ))}
    </svg>
  )
}

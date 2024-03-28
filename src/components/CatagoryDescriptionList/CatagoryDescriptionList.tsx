import { expenseColors } from '@lib/colors'
import { ExpenseTypes } from '@lib/types'

type CatagoryDescriptionProps = {
  x: number
  y: number
  type: ExpenseTypes
}

type CatagoryDescriptionListProps = {
  radius: number
}

function CatagoryDesc({ x, y, type }: CatagoryDescriptionProps) {
  return (
    <>
      <rect
        x={x}
        y={y}
        rx="4"
        ry="4"
        width="15"
        height="15"
        fill={expenseColors[type]}
      />
      <text
        x={x + 20}
        y={y + 2}
        dominantBaseline="hanging"
        fill={expenseColors[type]}
      >
        <tspan>{type.charAt(0)}</tspan>
        {type.slice(1)}
      </text>
    </>
  )
}

export default function CatagoryDescriptionList(
  props: CatagoryDescriptionListProps,
) {
  const pad = 10
  const dim = (pad + props.radius) * 2
  return (
    <svg width={dim} height={21 * Math.ceil(ExpenseTypes.length / 2)}>
      {ExpenseTypes.map((type, i) => (
        <CatagoryDesc
          key={type}
          x={i < Math.ceil(ExpenseTypes.length / 2) ? 0 : dim / 2}
          y={21 * Math.floor(i % (ExpenseTypes.length / 2))}
          type={type as ExpenseTypes}
        />
      ))}
    </svg>
  )
}

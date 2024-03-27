import { formatMoney } from 'src/lib/money'
import { ExpenseTypes } from 'src/lib/types'

export type CircleSection = {
  type: ExpenseTypes
  percentage: number
}

type MainSpendDisplayProps = {
  className?: string
  totalDisplayClassName?: string
  totalCents: number
  catagories: Record<ExpenseTypes, number> | undefined
  radius: number
}

const colors: Record<ExpenseTypes, string> = {
  HOUSING: '#39FF14', //neon green
  FUN: '#FFFF33', // neon yellow
  FOOD: '#1F51FF', // neon blue
  CLOTHES: '#FF3131', // neon red
  GROCERIES: '#BC13FE', // neon purple
  MISCELLANEOUS: '#FFA600', // neon orange
}

export default function MainSpendDisplay({
  radius: r,
  ...props
}: MainSpendDisplayProps) {
  let prev = 0
  const pad = 10
  const dim = (pad + r) * 2

  if (props.catagories == undefined) {
    return (
      <svg className={props.className} width={dim} height={dim}>
        <circle
          stroke="white"
          strokeWidth={4}
          fill="none"
          cx={pad + r}
          cy={pad + r}
          r={r}
        />
      </svg>
    )
  }

  return (
    <svg className={props.className} width={dim} height={dim + 300}>
      <text x={0} y={dim + 100} fill="white">
        bruh
      </text>
      <text
        x={dim / 2}
        y={dim / 2}
        dominantBaseline="central"
        textAnchor="middle"
        className={props.totalDisplayClassName}
        fill="white"
      >
        {formatMoney(props.totalCents)}
      </text>
      {props.catagories &&
        Object.keys(props.catagories).map((type) => {
          const p = props.catagories
            ? props.catagories[type as ExpenseTypes] / props.totalCents
            : 0
          const color = colors[type as ExpenseTypes]

          if (p === 1) {
            return (
              <circle
                key={type}
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
          prev += p
          return (
            <path
              key={type}
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
        })}
    </svg>
  )
}

import colors from '@lib/Colors'
import { ExpenseTypes } from '@lib/Types'
import { Svg, Rect, Text } from 'react-native-svg'

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
      <Rect
        x={x}
        y={y}
        rx="4"
        ry="4"
        width="15"
        height="15"
        fill={colors.expenses[type]}
      />
      <Text
        x={x + 20}
        y={y + 2}
        alignmentBaseline="hanging"
        fill={colors.expenses[type]}
      >
        {type}
      </Text>
    </>
  )
}

export default function CatagoryDescriptionList(
  props: CatagoryDescriptionListProps,
) {
  const pad = 10
  const dim = (pad + props.radius) * 2
  return (
    <Svg width={dim} height={21 * Math.ceil(ExpenseTypes.length / 2)}>
      {ExpenseTypes.map((type, i) => (
        <CatagoryDesc
          key={type}
          x={i < Math.ceil(ExpenseTypes.length / 2) ? 0 : dim / 2}
          y={21 * Math.floor(i % (ExpenseTypes.length / 2))}
          type={type as ExpenseTypes}
        />
      ))}
    </Svg>
  )
}

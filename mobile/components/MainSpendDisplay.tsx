import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import colors from '@lib/Colors'
import { formatMoney } from '@lib/Money'
import { ExpenseTypes, HomePageStats } from '@lib/Types'
import { Text, Svg, Path, Circle } from 'react-native-svg'

const MIN_THRESHOLD = 0.05

type CircleSection = {
  type: ExpenseTypes
  percentage: number
}

type MainSpendDisplayProps = {
  stats: HomePageStats | undefined
  radius: number
}

export default function MainSpendDisplay({
  radius: r,
  ...props
}: MainSpendDisplayProps) {
  const pad = 10
  const dim = (offset) * 2

  const values = useMemo(
    () =>
      ExpenseTypes.map((type) => {
        const val = props.stats ? props.stats.catagories[type] : 0
        return {
          type,
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
        type: '',
        value: 0,
      }).value,
    [values],
  )
  const sections: CircleSection[] = useMemo(
    () =>
      values.map(
        ({ type, value }) =>
        ({
          type,
          percentage: value / total,
        } satisfies CircleSection),
      ),
    [values, total],
  )

  if (props.stats == undefined) {
    return (
      <Svg style={styles.display} width={dim} height={dim}>
        <Circle
          stroke="black"
          strokeWidth={4}
          fill="none"
          cx={offset}
          cy={offset}
          r={r}
        />
        <Text
          x={dim / 2}
          y={dim / 2}
          textAnchor="middle"
          alignmentBaseline='middle'
          fontSize={36}
          fontWeight={600}
          fill="black"
        >
          ...
        </Text>
      </Svg>
    )
  }

  function Section({ percentage: p, type, i }: CircleSection & { i: number }) {
    if (p === 0) {
      return null
    }

    const prev = sections
      .slice(0, i)
      .map(({ percentage }) => percentage)
      .reduce((x, y) => x + y, 0) + 0.75

    if (p === 1) {
      return (
        <Circle
          cx={offset}
          cy={offset}
          r={r}
          stroke={colors.expenses[type]}
          strokeWidth={20}
          fill="none"
        />
      )
    }

    // magic number for spacing between
    const start = (prev + 0.022) * (2 * Math.PI)
    const end = (prev + p) * (2 * Math.PI)

    return (
      <Path
        d={`M ${offset + r * Math.cos(start)} ${offset + r * Math.sin(start)}
            A ${r} ${r} 0 ${p > 0.51 ? 1 : 0} 1 ${offset + r * Math.cos(end)} ${offset + r * Math.sin(end)}`}
        stroke={colors.expenses[type]}
        strokeWidth={15}
        strokeLinecap='round'
        fill="none"
      />
    )
  }

  return (
    <View style={styles.display}>
      <Svg
        width={'100%'}
        height={'100%'}
        viewBox={`0 0 ${dim} ${dim}`}
      >
        <Text
          x={dim / 2}
          y={dim / 2}
          textAnchor="middle"
          alignmentBaseline='middle'
          fontSize={36}
          fontWeight={600}
          fill="black"
        >
          {formatMoney(props.stats.totalCents)}
        </Text>
        {sections.sort((a, b) => b.percentage - a.percentage).map((s: CircleSection, i) => (
          <Section key={s.type} i={i} {...s} />
        ))}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  display: {
    width: '100%',
    height: 300,
  }
});

import { Text } from 'app/design/typography'
import { View } from 'app/design/view'

import { Pie, PolarChart } from 'victory-native'
import { Platform } from 'react-native'

function randomNumber() {
  return Math.floor(Math.random() * 26) + 125
}
function generateRandomColor(): string {
  // Generating a random number between 0 and 0xFFFFFF
  const randomColor = Math.floor(Math.random() * 0xffffff)
  // Converting the number to a hexadecimal string and padding with zeros
  return `#${randomColor.toString(16).padStart(6, '0')}`
}
const DATA = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }))
export default function CategoryDonutChart() {
  return (
    <>
      <Text>CategoryBreakdown</Text>
      <View className="h-60">
        <PolarChart
          data={DATA(5)}
          labelKey={'label'}
          valueKey={'value'}
          colorKey={'color'}
        >
          <Pie.Chart innerRadius={80}>
            {() => (
              <>
                <Pie.Slice />
                <Pie.SliceAngularInset
                  angularInset={{
                    angularStrokeWidth: 2,
                    angularStrokeColor: 'white',
                  }}
                />
              </>
            )}
          </Pie.Chart>
        </PolarChart>
      </View>
    </>
  )
}

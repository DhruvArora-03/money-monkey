import { H1 } from 'app/design/typography'
import { View } from 'app/design/view'
import Auth from 'app/features/auth/Auth'

import CategoryDonutChart from 'app/features/dashboard/CategoryDonutChart'

export function HomeScreen() {
  return (
    <View className="flex-1 p-3">
      <H1>Dashboard</H1>
      <CategoryDonutChart />
      <Auth />
    </View>
  )
}

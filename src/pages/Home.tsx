import { getHomeScreenStats } from '@lib/money'
import styles from './home.module.css'
import {
  CatagoryDescriptionList,
  Cell,
  MainSpendDisplay,
  Select,
  SignOutButton,
} from '@components'
import { useEffect, useState } from 'react'
import { ExpenseTypes, HomePageStats, months, MonthsType } from '@lib/types'

export default function HomePage() {
  const [stats, setStats] = useState<HomePageStats>()
  const [month, setMonth] = useState<>(0)
  const [year, setYear] = useState(2024)

  useEffect(() => {
    getHomeScreenStats(0, 2024).then(setStats)
  }, [])

  return (
    <div className={styles.page}>
      <h1>Expenses</h1>
      <h2>March 2024</h2>
      <Select options={months} value={month} onChange={setMonth} />
      <Select options={} value={year} onChange={setYear} />
      <div className={styles.mainDisplay}>
        <MainSpendDisplay
          totalDisplayClassName={styles.totalSpend}
          stats={stats}
          radius={125}
        />
        <CatagoryDescriptionList radius={125} />s S
      </div>
      <div className={styles.list}>
        {stats &&
          ExpenseTypes.map((type) => (
            <Cell
              key={type}
              label={type}
              amountCents={stats.catagories[type as ExpenseTypes]}
            />
          ))}
      </div>
      <SignOutButton />
    </div>
  )
}

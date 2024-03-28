import { getHomeScreenStats } from 'src/lib/money'
import styles from './home.module.css'
import {
  CatagoryDescriptionList,
  Cell,
  MainSpendDisplay,
  SignOutButton,
} from '@components'
import { useEffect, useState } from 'react'
import { ExpenseTypes, HomePageStats } from 'src/lib/types'

export default function HomePage() {
  // const [totalCents, setTotalCents] = useState(0)
  // const [catagories, setCatagories] = useState<Record<ExpenseTypes, number>>()
  const [stats, setStats] = useState<HomePageStats>()

  useEffect(() => {
    getHomeScreenStats(0, 2024).then(setStats)
  }, [])

  return (
    <div className={styles.page}>
      <h1>Expenses</h1>
      <h2>March 2024</h2>
      <div className={styles.mainDisplay}>
        <MainSpendDisplay
          totalDisplayClassName={styles.totalSpend}
          stats={stats}
          radius={125}
        />
        <CatagoryDescriptionList
          catagoryTextClassName={styles.catagory}
          radius={125}
        />
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

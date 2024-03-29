import { getHomeScreenStats } from '@lib/money'
import styles from './home.module.css'
import {
  CatagoryDescriptionList,
  // CatagoryView,
  Cell,
  MainSpendDisplay,
  Select,
  SignOutButton,
} from '@components'
import { useEffect, useState } from 'react'
import { ExpenseTypes, HomePageStats, months, years } from '@lib/types'

export default function HomePage() {
  const [stats, setStats] = useState<HomePageStats>()
  const [month, setMonth] = useState(0)
  const [year, setYear] = useState(0)
  const [currentCatagory, setCurrentCatagory] = useState<ExpenseTypes>()

  useEffect(() => {
    getHomeScreenStats(month, years[year]).then(setStats)
  }, [])

  return (
    <div className={styles.page}>
      <h1>Total Expenditures</h1>
      <div className={styles.mainDisplay}>
        <div className={styles.datePicker}>
          <Select options={months} value={month} setValue={setMonth} />
          <Select options={years} value={year} setValue={setYear} />
        </div>
        <MainSpendDisplay
          totalDisplayClassName={styles.totalSpend}
          stats={stats}
          radius={125}
        />
        <CatagoryDescriptionList radius={125} />
      </div>
      {/* {stats && currentCatagory && (
        <CatagoryView
          type={currentCatagory}
          catagoryAmountCents={stats.catagories[currentCatagory]}
        />
      )} */}
      <div className={styles.list}>
        {ExpenseTypes.map((type) => (
          <Cell
            key={type}
            type={type}
            amountCents={stats ? stats.catagories[type as ExpenseTypes] : 0}
            expanded={type === currentCatagory}
            setCurrentCatagory={setCurrentCatagory}
          />
        ))}
      </div>
      <SignOutButton />
    </div>
  )
}

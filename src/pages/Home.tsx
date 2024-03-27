import { getHomeScreenStats } from 'src/lib/money'
import styles from './home.module.css'
import { Cell, MainSpendDisplay, SignOutButton } from '@components'
import { useEffect, useState } from 'react'
import { ExpenseTypes } from 'src/lib/types'

export default function HomePage() {
  const [totalCents, setTotalCents] = useState(0)
  const [catagories, setCatagories] = useState<Record<ExpenseTypes, number>>()

  useEffect(() => {
    getHomeScreenStats().then(({ totalCents, catagories }) => {
      setTotalCents(totalCents)
      setCatagories(catagories)
    })
  }, [])

  return (
    <div className={styles.page}>
      <h1>Expenses</h1>
      <h2>March 2024</h2>
      <div className={styles.mainDisplay}>
        <MainSpendDisplay
          totalCents={totalCents}
          catagories={catagories}
          radius={125}
          totalDisplayClassName={styles.totalSpend}
        />
      </div>
      <div className={styles.list}>
        {catagories &&
          Object.keys(catagories).map((type) => (
            <Cell
              key={type}
              label={type}
              amountCents={catagories[type as ExpenseTypes]}
            />
          ))}
      </div>
      <SignOutButton />
    </div>
  )
}

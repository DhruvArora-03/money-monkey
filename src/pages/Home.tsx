import { formatMoney, getHomeScreenStats } from 'src/lib/money'
import styles from './home.module.css'
import { Cell, SignOutButton } from '@components'
import { useState } from 'react'
import { ExpenseTypes } from 'src/lib/types'

export default function HomePage() {
  const [totalCents, setTotalCents] = useState(0)
  const [catagories, setCatagories] = useState<Record<ExpenseTypes, number>>()

  getHomeScreenStats().then(({ totalCents, catagories }) => {
    setTotalCents(totalCents)
    setCatagories(catagories)
  })

  return (
    <div className={styles.page}>
      <h1>Money Monkey</h1>
      <div className={styles.mainDisplay}>
        <h2 className={styles.totalSpend}>{formatMoney(totalCents)}</h2>
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

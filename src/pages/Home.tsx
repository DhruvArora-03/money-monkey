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
          Object.keys(catagories).map((k) => (
            <Cell
              key={k}
              label={k}
              amountCents={catagories[k as ExpenseTypes]}
            />
          ))}
        <Cell label="Food" amountCents={31219} />
        <Cell label="Rent" amountCents={120000} />
        <Cell label="Utilities" amountCents={10514} />
        <Cell label="Entertainment" amountCents={3750} />
        <Cell label="Miscellanous" amountCents={6482} />
      </div>
      <SignOutButton />
    </div>
  )
}
{
  /* <div className={clsx(props.className, styles.list)}>
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
    </div> */
}

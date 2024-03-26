import styles from './home.module.css'
import { Cell, ExpenseList, SignOutButton } from '@components'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <ExpenseList />
      <Cell label="Food" amountCents={31219} />
      <SignOutButton />
    </div>
  )
}

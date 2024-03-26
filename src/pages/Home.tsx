import styles from './home.module.css'
import { CatagoryList, SignOutButton } from '@components'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div style={{ padding: '130px' }}></div>
      {/* <ExpenseList /> */}
      <CatagoryList />
      <SignOutButton />
    </div>
  )
}

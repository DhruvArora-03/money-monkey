import styles from './expense.module.css'
import { formatMoney } from '@lib/money'
import { ExpenseItemWithoutID } from '@lib/types'

export default function Expense(props: ExpenseItemWithoutID) {
  return (
    <div className={styles.expense}>
      <div>{props.name}</div>
      <div>{props.date && props.date.toDate().toDateString()}</div>
      <div>{formatMoney(props.amountCents)}</div>
    </div>
  )
}

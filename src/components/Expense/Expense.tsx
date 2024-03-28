import { formatMoney } from '@lib/money'
import { ExpenseItem } from '@lib/types'

export default function Expense(props: ExpenseItem) {
  console.log(props)
  return (
    <div>
      {props.name}
      <br />
      {props.date && props.date.toDate().toDateString()}
      <br />
      {formatMoney(props.amountCents)}
      <br />
      {props.type}
      <br />
    </div>
  )
}

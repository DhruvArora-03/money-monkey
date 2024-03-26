import { ExpenseItem } from 'src/lib/types'

export default function Expense(props: ExpenseItem) {
  console.log(props)
  return (
    <div>
      {props.name}
      <br />
      {props.date && props.date.toDate().toDateString()}
      <br />
      {`$${props.amountCents / 100}`}
      <br />
      {props.type}
      <br />
    </div>
  )
}

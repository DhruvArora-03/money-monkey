import { ExpenseTypes } from '@lib/types'
import styles from './catagoryView.module.css'
import { formatMoney } from '@lib/money'

type CatagoryViewProps = {
  type: ExpenseTypes
  catagoryAmountCents: number
}

export default function CatagoryView(props: CatagoryViewProps) {
  return (
    <div className={styles.view}>
      {props.type}
      {formatMoney(props.catagoryAmountCents)}
    </div>
  )
}

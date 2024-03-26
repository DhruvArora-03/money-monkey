import { formatMoney } from 'src/lib/money'
import styles from './cell.module.css'

type CellProps = {
  label: string
  amountCents: number
}

export default function Cell(props: CellProps) {
  return (
    <div className={styles.cell}>
      <div className={styles.label}>{props.label}</div>
      <div>{formatMoney(props.amountCents)}</div>
    </div>
  )
}

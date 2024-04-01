import { formatMoney } from '@lib/money'
import styles from './cell.module.css'
import { ExpenseTypes } from '@lib/types'
import { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'

type CellProps = {
  type: ExpenseTypes
  amountCents: number
  expanded?: boolean
  setCurrentCatagory: Dispatch<SetStateAction<ExpenseTypes | undefined>>
}

export default function Cell(props: CellProps) {
  return (
    <div
      className={clsx(styles.cell, props.expanded && styles.expanded)}
      onClick={() =>
        props.setCurrentCatagory(props.expanded ? undefined : props.type)
      }
    >
      <div className={styles.main}>
        <div className={styles.label}>{props.type}</div>
        <div>{formatMoney(props.amountCents)}</div>
      </div>
      <div className={styles.details}>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
        <div>extra content</div>
      </div>
    </div>
  )
}

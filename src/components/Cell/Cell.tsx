import { useEffect, useState } from 'react'
import { formatMoney } from '@lib/money'
import styles from './cell.module.css'
import { ExpenseItem, ExpenseTypes } from '@lib/types'
import { Dispatch, SetStateAction } from 'react'
import { getCatagoryExpenses } from '@lib/firebase'
import { Expense } from '@components'

type CellProps = {
  type: ExpenseTypes
  amountCents: number
  expanded?: boolean
  setCurrentCatagory: Dispatch<SetStateAction<ExpenseTypes | undefined>>
  month: number
  year: number
}

export default function Cell(props: CellProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<ExpenseItem[]>([])

  useEffect(() => {
    if (props.expanded) {
      setIsLoading(true)
      getCatagoryExpenses(props.type, props.month, props.year).then(setContent)
      setIsLoading(false)
    }
  }, [props.expanded])

  return (
    <div
      className={styles.cell}
      onClick={() =>
        props.setCurrentCatagory(props.expanded ? undefined : props.type)
      }
    >
      <div className={styles.main}>
        <div className={styles.label}>{props.type}</div>
        <div>{formatMoney(props.amountCents)}</div>
      </div>
      {props.expanded && (
        <div className={styles.details}>
          {isLoading
            ? 'Loading...'
            : content.length > 0
              ? content.map(({ id: itemID, ...item }: ExpenseItem) => (
                <Expense key={itemID} {...item} />
              ))
              : 'No expenses found'}
        </div>
      )}
    </div>
  )
}

import { DateInput, MoneyInput, Select, TextInput } from '@components'
import styles from './createExpensePopup.module.css'
import { MdClose } from 'react-icons/md'
import { useState } from 'react'
import { ExpenseTypes } from '@lib/types'

type CreateExpensePopupProps = {
  onClose?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>
}

export default function CreateExpensePopup(props: CreateExpensePopupProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<number>()

  return (
    <div>
      <div className={styles.background} onClick={props.onClose}></div>
      <div className={styles.popup}>
        <h3>Create Expense</h3>
        <button className={styles.closeButton} onClick={props.onClose}>
          <MdClose size={20} />
        </button>
        <div className={styles.inputs}>
          <TextInput label='Name' value={name} setValue={setName} />
          <MoneyInput label='Amount' value={amount} setValue={setAmount} />
          <DateInput label='Date' value={date} setValue={setDate} />
          <Select options={ExpenseTypes} value={type} setValue={setType} />
        </div>
      </div>
    </div>
  )
}

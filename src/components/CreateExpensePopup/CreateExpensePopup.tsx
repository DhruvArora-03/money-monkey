import { DateInput, MoneyInput, Select, TextInput } from '@components'
import styles from './createExpensePopup.module.css'
import { MdClose } from 'react-icons/md'
import { useState } from 'react'
import { ExpenseTypes } from '@lib/types'

type InputWrapperProps = {
  label: string
  htmlFor?: string
  children: React.ReactNode
}

type CreateExpensePopupProps = {
  onClose?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>
}

function InputWrapper(props: InputWrapperProps) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={props.htmlFor ?? props.label}>
        {props.label}:
      </label>
      {props.children}
    </div>
  )
}

export default function CreateExpensePopup(props: CreateExpensePopupProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<number>()

  return (
    <div>
      <div
        className={styles.background}
        onClick={() => {}}
        onScroll={() => {}}
        onScrollCapture={() => {}}
        onWheelCapture={() => {}}
      ></div>
      <div className={styles.popup}>
        <h3>Create Expense</h3>
        <button className={styles.closeButton} onClick={props.onClose}>
          <MdClose size={20} />
        </button>
        <form onSubmit={() => {}}>
          <div className={styles.inputs}>
            <InputWrapper label="Name" htmlFor="ExpenseName">
              <TextInput
                id="Expense Name"
                className={styles.input}
                value={name}
                setValue={setName}
              />
            </InputWrapper>
            <InputWrapper label="Amount">
              <MoneyInput
                id="Amount"
                className={styles.input}
                value={amount}
                setValue={setAmount}
              />
            </InputWrapper>
            <InputWrapper label="Date">
              <DateInput
                id="Date"
                className={styles.input}
                value={date}
                setValue={setDate}
              />
            </InputWrapper>
            <InputWrapper label="Amount">
              <Select
                id="Amount"
                className={styles.input}
                options={ExpenseTypes}
                value={type}
                setValue={setType}
              />
            </InputWrapper>
          </div>
          <button className={styles.createButton}>Create</button>
        </form>
      </div>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateInput, MoneyInput, Select, TextInput } from '@components'
import styles from './createExpensePopup.module.css'
import { MdClose } from 'react-icons/md'
import { useState } from 'react'
import { ExpenseItem, ExpenseTypeOptions, ExpenseTypes } from '@lib/types'
import { Field, Form, Formik } from 'formik'
import { Timestamp } from 'firebase/firestore'

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
  // const [name, setName] = useState('')
  // const [amount, setAmount] = useState('')
  // const [date, setDate] = useState('')
  // const [type, setType] = useState<number>()

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
        <Formik
          initialValues={{ name: '', amount: '', date: '', type: 0 }}
          onSubmit={(values) => {
            console.log({
              name: '',
              date: new Timestamp(new Date(values.date).getTime(), 0),
              amountCents: +values.amount * 100,
              type: ExpenseTypes[values.type - 1],
            } satisfies ExpenseItem)
          }}
        >
          {() => (
            <Form>
              <div className={styles.inputs}>
                <InputWrapper label="Name" htmlFor="name">
                  <Field
                    id="name"
                    className={styles.input}
                    component={TextInput}
                  />
                  {/* <TextInput id="name" className={styles.input} /> */}
                </InputWrapper>
                {/* <InputWrapper label="Amount" htmlFor="ExpenseAmount">
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
                    options={ExpenseTypeOptions}
                    value={type}
                    setValue={setType}
                  /> */}
                {/* </InputWrapper> */}
              </div>
              <div className={styles.buttons}>
                <button onClick={props.onClose}>Cancel</button>
                <button className={styles.createButton} type="submit">
                  Create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

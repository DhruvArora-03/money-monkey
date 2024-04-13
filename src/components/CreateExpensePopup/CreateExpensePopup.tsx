import styles from './createExpensePopup.module.css'
import { MdClose } from 'react-icons/md'
import { ExpenseItem, ExpenseTypeOptions, ExpenseTypes } from '@lib/types'
import { Field, Form, Formik } from 'formik'
import { MoneyField } from '@components'
import { addNewExpense } from '@lib/firebase'
import { Timestamp } from '@firebase/firestore'

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
  return (
    <div>
      <div className={styles.background} onClick={() => {}}></div>
      <div className={styles.popup}>
        <h3>Create Expense</h3>
        <button className={styles.closeButton} onClick={props.onClose}>
          <MdClose size={23} />
        </button>
        <Formik
          initialValues={{ name: '', amount: '', date: '', type: 0 }}
          onSubmit={async (values) => {
            const date = values.date.split('-', 3).map((x) => +x)
            await addNewExpense({
              name: values.name,
              date: Timestamp.fromDate(new Date(date[0], date[1] - 1, date[2])),
              amountCents: +values.amount * 100,
              type: ExpenseTypes[values.type - 1],
            } satisfies ExpenseItem)
            document.getElementById('cancel-button')?.click()
          }}
        >
          {() => (
            <Form>
              <div className={styles.inputs}>
                <InputWrapper label="Name" htmlFor="expense-name">
                  <Field
                    id="expense-name"
                    name="name"
                    className={styles.input}
                  />
                </InputWrapper>
                <InputWrapper label="Amount" htmlFor="expense-amount">
                  <Field
                    name="amount"
                    id="expense-amount"
                    className={styles.input}
                    component={MoneyField}
                  />
                </InputWrapper>
                <InputWrapper label="Date" htmlFor="expense-date">
                  <Field
                    name="date"
                    id="expense-date"
                    type="date"
                    className={styles.input}
                  />
                </InputWrapper>
                <InputWrapper label="Type" htmlFor="expense-type">
                  <Field
                    name="type"
                    id="expense-type"
                    className={styles.input}
                    as="select"
                  >
                    {ExpenseTypeOptions.map((label, i) => (
                      <option key={label} value={i}>
                        {label}
                      </option>
                    ))}
                  </Field>
                </InputWrapper>
              </div>
              <div className={styles.buttons}>
                <button id="cancel-button" onClick={props.onClose}>
                  Cancel
                </button>
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

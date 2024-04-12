import styles from './createExpensePopup.module.css'
import { MdClose } from 'react-icons/md'
import { ExpenseItem, ExpenseTypes } from '@lib/types'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Timestamp } from 'firebase/firestore'
import { MoneyInput } from '@components'

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
                <InputWrapper label="Name" htmlFor="expense-name">
                  <Field
                    id="expense-name"
                    name="name"
                    className={styles.input}
                  />
                </InputWrapper>
                <InputWrapper label="Amount" htmlFor="expense-amount">
                  <Field name="amount">
                    {({ field }: FieldProps) => (
                      <MoneyInput
                        id="expense-amount"
                        className={styles.input}
                        field={field}
                      />
                    )}
                  </Field>
                </InputWrapper>
                {/* <InputWrapper label="Date">
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
                  />
                </InputWrapper> */}
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

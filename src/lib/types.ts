import * as Yup from 'yup'
import { Timestamp } from 'firebase/firestore'

export const ExpenseTypes = [
  'Housing',
  'Food',
  'Groceries',
  'Entertainment',
  'Clothes',
  'Necessities',
  'Miscellaneous',
]

export type ExpenseTypes = (typeof ExpenseTypes)[number]

export const ExpenseTypeOptions = ['', ...ExpenseTypes]

export type ExpenseItem = {
  name: string
  date: Timestamp
  amountCents: number
  type: ExpenseTypes
}

export type HomePageStats = {
  totalCents: number
  catagories: Record<ExpenseTypes, number>
}

export const months = [
  'All Months',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const start_year = 2024
export const years: number[] = new Array(
  new Date().getFullYear() - start_year + 1,
)
  .fill(start_year)
  .map((x, i) => x + i)

export const NewExpenseSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required!')
    .min(1, 'Too short!')
    .max(50, 'Too long!'),
  amount: Yup.string()
    .required('Required!')
    .matches(RegExp(/^\d+(.\d{0,2})?$/), 'Numbers and decimal only')
    .test('min-test', 'Enter at least $0.01!', (value) =>
      value ? parseFloat(value) > 0 : false,
    ),
  date: Yup.string()
    .required('Required!')
    .length(10, 'Must enter a full date!')
    .matches(RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/), 'Must select a valid date!'),
  type: Yup.number().required('Required!').min(1, 'Must select something'),
})

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

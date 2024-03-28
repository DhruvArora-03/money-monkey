import { Timestamp } from 'firebase/firestore'

export const ExpenseTypes = [
  'Housing',
  'Food',
  'Groceries',
  'Entertainment',
  'Clothes',
  'Necessities',
  'Miscellaneous',
] as const

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
] as const

export type MonthsNumberType =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12

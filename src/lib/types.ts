import { Timestamp } from 'firebase/firestore'

export const ExpenseTypes = [
  'HOUSING',
  'FOOD',
  'GROCERIES',
  'ENTERTAINMENT',
  'CLOTHES',
  'NECESSITIES',
  'MISCELLANEOUS',
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

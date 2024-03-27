import { Timestamp } from 'firebase/firestore'

export type ExpenseTypes =
  | 'HOUSING'
  | 'FOOD'
  | 'FUN'
  | 'CLOTHES'
  | 'GROCERIES'
  | 'MISCELLANEOUS'

export type ExpenseItem = {
  name: string
  date: Timestamp
  amountCents: number
  type: ExpenseTypes
}

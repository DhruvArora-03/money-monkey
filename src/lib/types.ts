import { Timestamp } from 'firebase/firestore'

export type ExpenseTypes = 'RENT' | 'FOOD' | 'FUN' | 'CLOTHES' | 'GROCERIES'

export type ExpenseItem = {
  name: string
  date: Timestamp
  amountCents: number
  type: ExpenseTypes
}

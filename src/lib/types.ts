import { Timestamp } from 'firebase/firestore'

export type ExpenseTypes = 'HOUSING'

export type ExpenseItem = {
  name: string
  date: Timestamp
  amountCents: number
  type: ExpenseTypes
}

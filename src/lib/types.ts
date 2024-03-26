import { Timestamp } from 'firebase/firestore'

export enum ExpenseTypes {
  HOUSING,
}

export type ExpenseItem = {
  name: string
  date: Timestamp
  amountCents: number
  type: ExpenseTypes.HOUSING
}

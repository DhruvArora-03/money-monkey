import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { ExpenseItem, ExpenseTypes } from './types'

export function formatMoney(amountCents: number) {
  return `$${(amountCents / 100).toFixed(2)}`
}

export async function getHomeScreenStats() {
  return {
    totalCents: 210863,
    catagories: {
      HOUSING: 132800,
      FOOD: 15437,
      FUN: 12346,
      CLOTHES: 14508,
      GROCERIES: 26743,
      MISCELLANEOUS: 9029,
    },
  }
  const db = getFirestore()
  const snapshot = await getDocs(collection(db, 'expenses'))

  let totalCents = 0
  const catagories: Record<ExpenseTypes, number> = {
    HOUSING: 0,
    FOOD: 0,
    FUN: 0,
    CLOTHES: 0,
    GROCERIES: 0,
    MISCELLANEOUS: 0,
  }

  snapshot.docs
    .map((doc) => doc.data() as ExpenseItem)
    .forEach((d) => {
      totalCents += d.amountCents
      catagories[d.type] += d.amountCents
    })

  return {
    totalCents,
    catagories,
  }
}

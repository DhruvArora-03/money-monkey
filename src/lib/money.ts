import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { ExpenseItem, ExpenseTypes } from './types'

export function formatMoney(amountCents: number) {
  return `$${(amountCents / 100).toFixed(2)}`
}

export async function getHomeScreenStats() {
  const db = getFirestore()
  const snapshot = await getDocs(collection(db, 'expenses'))

  let totalCents = 0
  const catagories: Record<ExpenseTypes, number> = {
    HOUSING: 0,
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

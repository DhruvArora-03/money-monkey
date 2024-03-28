import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import { ExpenseItem, ExpenseTypes, HomePageStats } from './types'
import { getAuth } from 'firebase/auth'

export function formatMoney(amountCents: number) {
  return `$${(amountCents / 100).toFixed(2)}`
}

export async function getHomeScreenStats(month: number, year: number) {
  return {
    totalCents: 195867,
    catagories: {
      HOUSING: 132800,
      FOOD: 15437,
      ENTERTAINMENT: 12346,
      CLOTHES: 14508,
      GROCERIES: 26743,
      NECESSITIES: 2004,
      MISCELLANEOUS: 2029,
    },
  } satisfies HomePageStats
  const start = new Date(year, Math.max(0, month - 1), 1)
  const end = new Date(month === 0 ? year + 1 : year, month, 1)

  const auth = getAuth()
  const expenses = collection(getFirestore(), 'expenses')
  const snapshot = await getDocs(
    query(
      expenses,
      where('uid', '==', auth.currentUser?.uid),
      where('date', '>=', start),
      where('date', '<=', end),
    ),
  )

  let totalCents = 0
  const catagories: Record<ExpenseTypes, number> = {
    HOUSING: 0,
    FOOD: 0,
    ENTERTAINMENT: 0,
    CLOTHES: 0,
    GROCERIES: 0,
    NECESSITIES: 0,
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

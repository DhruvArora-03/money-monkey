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
      Housing: 132800,
      Food: 15437,
      Entertainment: 12346,
      Clothes: 14508,
      Groceries: 26743,
      Necessities: 2004,
      Miscellaneous: 2029,
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
    Housing: 0,
    Food: 0,
    Entertainment: 0,
    Clothes: 0,
    Groceries: 0,
    Necessities: 0,
    Miscellaneous: 0,
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

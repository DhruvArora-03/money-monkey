import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import { ExpenseItem, ExpenseTypes, HomePageStats } from './types'
import { getAuth } from 'firebase/auth'

export async function getHomeScreenStats(month: number, year: number) {
  const random = new Array(7)
    .fill(0)
    .map(() => Math.floor(100_00 - Math.random() * 200_00))
  return {
    totalCents: 195867 + random.reduce((x, y) => x + y),
    catagories: {
      Housing: 132800 + random[0],
      Food: 15437 + random[1],
      Entertainment: 12346 + random[2],
      Clothes: 14508 + random[3],
      Groceries: 26743 + random[4],
      Necessities: 2004 + random[5],
      Miscellaneous: 2029 + random[6],
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

export async function addNewExpense(expense: ExpenseItem) {
  console.log(expense)
  const auth = getAuth()
  const expenses = collection(getFirestore(), 'expenses')
  await addDoc(expenses, { uid: auth.currentUser?.uid, ...expense })
}

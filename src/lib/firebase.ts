import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import {
  ExpenseItem,
  ExpenseItemWithoutID,
  ExpenseTypes,
  HomePageStats,
  MONTHS,
  YEARS,
} from '@lib/types'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyADet9ooqhq2lZuX0K9i8DDawu_kW9sZso',
  authDomain: 'dhruv-budget-app.firebaseapp.com',
  projectId: 'dhruv-budget-app',
  storageBucket: 'dhruv-budget-app.appspot.com',
  messagingSenderId: '616520665199',
  appId: '1:616520665199:web:b1977d2a42d884f1a6e59a',
  measurementId: 'G-4GPLMLQZ1J',
}

// Initialize Firebase
initializeApp(firebaseConfig)

export async function getHomeScreenStats(month: number, year: number) {
  // const random = new Array(7)
  //   .fill(0)
  //   .map(() => Math.floor(100_00 - Math.random() * 200_00))
  // return {
  //   totalCents: 195867 + random.reduce((x, y) => x + y),
  //   catagories: {
  //     Housing: 132800 + random[0],
  //     Food: 15437 + random[1],
  //     Entertainment: 12346 + random[2],
  //     Clothes: 14508 + random[3],
  //     Groceries: 26743 + random[4],
  //     Necessities: 2004 + random[5],
  //     Miscellaneous: 2029 + random[6],
  //   },
  // } satisfies HomePageStats

  const auth = getAuth()
  const catagoriesRef = collection(getFirestore(), 'catagories')
  const snapshot = await getDocs(
    month === 0
      ? query(
        catagoriesRef,
        where('uid', '==', auth.currentUser?.uid),
        where('year', '==', YEARS[year]),
      )
      : query(
        catagoriesRef,
        where('uid', '==', auth.currentUser?.uid),
        where('month', '==', MONTHS[month]),
        where('year', '==', YEARS[year]),
      ),
  )

  let totalCents = 0
  const catagories: HomePageStats['catagories'] = {
    Housing: 0,
    Food: 0,
    Entertainment: 0,
    Clothes: 0,
    Groceries: 0,
    Necessities: 0,
    Miscellaneous: 0,
  }

  snapshot.docs
    .map((doc) => doc.data())
    .forEach((d) => {
      totalCents += d.amountCents
      catagories[d.type] += d.amountCents
    })

  return {
    totalCents,
    catagories,
  } satisfies HomePageStats
}

export async function addNewExpense(expense: ExpenseItemWithoutID) {
  const auth = getAuth()

  if (!auth.currentUser) {
    return
  }
  const expensesRef = collection(getFirestore(), 'expenses')
  await addDoc(expensesRef, { uid: auth.currentUser.uid, ...expense })

  const month = MONTHS[new Date().getMonth() + 1]
  const year = new Date().getFullYear()
  console.log(`${month}, ${year}`)
  const catagoriesRef = collection(getFirestore(), 'catagories')
  const snapshot = await getDocs(
    query(
      catagoriesRef,
      where('uid', '==', auth.currentUser.uid),
      where('month', '==', month),
      where('year', '==', year),
      where('type', '==', expense.type),
    ),
  )

  if (snapshot.docs.length === 0) {
    addDoc(catagoriesRef, {
      uid: auth.currentUser.uid,
      amountCents: expense.amountCents,
      type: expense.type,
      month: month,
      year: year,
    })
  } else {
    const { amountCents: oldAmountCents, ...doc } = snapshot.docs[0].data()
    setDoc(snapshot.docs[0].ref, {
      amountCents: oldAmountCents + expense.amountCents,
      ...doc,
    })
  }
}

export async function getCatagoryExpenses(
  type: ExpenseTypes,
  month: number,
  year: number,
) {
  const start = new Date(YEARS[year], Math.max(0, month - 1), 1)
  const end = new Date(month === 0 ? YEARS[year] + 1 : YEARS[year], month, 1)

  const auth = getAuth()
  const expensesRef = collection(getFirestore(), 'expenses')
  const snapshot = await getDocs(
    query(
      expensesRef,
      where('uid', '==', auth.currentUser?.uid),
      where('date', '>=', start),
      where('date', '<=', end),
      where('type', '==', type),
    ),
  )

  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as ExpenseItem,
  )
}

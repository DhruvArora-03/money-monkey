import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ExpenseItem } from 'src/lib/types'
import Expense from '../Expense/Expense'

type ExpenseListProps = {
  className?: string
}

export default function ExpenseList(props: ExpenseListProps) {
  const db = getFirestore()
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])

  useEffect(() => {
    getDocs(collection(db, 'expenses')).then((snapshot) =>
      setExpenses(snapshot.docs.map((doc) => doc.data() as ExpenseItem)),
    )
  }, [db])

  return <div className={props.className}>{expenses.map(Expense)}</div>
}

import { useEffect, useState } from 'react'
import { formatMoney } from '@lib/Money'
import { ExpenseItem, ExpenseTypes } from '@lib/Types'
import { Dispatch, SetStateAction } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import Colors from '@lib/Colors'

type CellProps = {
  type: ExpenseTypes
  amountCents: number
  expanded?: boolean
  setCurrentCatagory: Dispatch<SetStateAction<ExpenseTypes | undefined>>
  month: number
  year: number
}

export default function Cell(props: CellProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<ExpenseItem[]>([])

  useEffect(() => {
    if (props.expanded) {
      setIsLoading(true)
      // getCatagoryExpenses(props.type, props.month, props.year).then(setContent)
      setIsLoading(false)
    }
  }, [props.expanded])

  return (
    <Pressable
      style={{borderColor: Colors.expenses[props.type], ...styles.cell}}
      onPress={() =>
        props.setCurrentCatagory(props.expanded ? undefined : props.type)
      }
    >
      <View style={styles.main}>
        <Text style={styles.label} >{props.type}</Text>
        <Text style={styles.amount}>{formatMoney(props.amountCents)}</Text>
      </View>
      {/* {props.expanded && (
        <div style={styles.details}>
          {isLoading
            ? 'Loading...'
            : content.length > 0
              ? content.map(({ id: itemID, ...item }: ExpenseItem) => (
                <Expense key={itemID} {...item} />
              ))
              : 'No expenses found'}
        </div>
      )} */}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
  },
})
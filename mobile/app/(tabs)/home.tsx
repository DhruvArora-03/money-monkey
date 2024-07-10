import { StyleSheet, ScrollView, View, useWindowDimensions } from 'react-native';
import MainSpendDisplay from '@components/MainSpendDisplay';
import { ExpenseTypes, HomePageStats } from '@lib/Types';
import CatagoryDescriptionList from '@components/CatagoryDescriptionList';
import Cell from '@components/Cell';
import { useState } from 'react';

export default function HomeScreen() {
  const [currentCatagory, setCurrentCatagory] = useState<ExpenseTypes>()
  const { width } = useWindowDimensions()
  const radius = (width - 70 - 30) / 2

  const random = new Array(7)
    .fill(0)
    .map(() => Math.floor(100_00 - Math.random() * 200_00))
  const stats = {
    totalCents: 2_808_67 + random.reduce((x, y) => x + y),
    catagories: {
      Housing: 1_328_00 + random[0],
      Food: 254_37 + random[1],
      Entertainment: 173_46 + random[2],
      Clothes: 145_08 + random[3],
      Groceries: 467_43 + random[4],
      Necessities: 220_04 + random[5],
      Miscellaneous: 220_29 + random[6],
    },
  } satisfies HomePageStats
  console.log(stats)

  return (
    <ScrollView contentContainerStyle={styles.page} overScrollMode="never">
      <View style={styles.container}>
        <MainSpendDisplay
          radius={radius}
          stats={stats}
        />
        <CatagoryDescriptionList
          radius={radius}
        />
      </View>
      <View style={styles.list}>
        {ExpenseTypes.map((type) => (
          <Cell
            key={type}
            type={type}
            amountCents={stats ? stats.catagories[type as ExpenseTypes] : 0}
            expanded={type === currentCatagory}
            setCurrentCatagory={setCurrentCatagory}
            month={0}
            year={2024}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  container: {
    padding: 10,
    width: '100%',
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  list: {
    width: '100%',
    gap: 8,
  },
});

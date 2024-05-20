import { StyleSheet, Text, View } from 'react-native';

import MainSpendDisplay from '@/components/MainSpendDisplay';
import { HomePageStats } from '@lib/Types';
import CatagoryDescriptionList from '@/components/CatagoryDescriptionList';

export default function TabOneScreen() {
  const random = new Array(7)
    .fill(0)
    .map(() => Math.floor(100_00 - Math.random() * 200_00))
  const stats = {
    totalCents: 1_958_67 + random.reduce((x, y) => x + y),
    catagories: {
      Housing: 1_328_00 + random[0],
      Food: 154_37 + random[1],
      Entertainment: 123_46 + random[2],
      Clothes: 145_08 + random[3],
      Groceries: 267_43 + random[4],
      Necessities: 20_04 + random[5],
      Miscellaneous: 20_29 + random[6],
    },
  } satisfies HomePageStats 
  return (
  <View style={styles.page}>
    <View style={styles.container}>
      <MainSpendDisplay
        radius={145} 
        stats={stats}
        />  
      <CatagoryDescriptionList
        radius={125} 
      />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: 350,
    margin: 10,
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
    shadowColor: 'yellow',
    shadowRadius: 100,
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 1
     
  },
});

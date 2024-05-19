import { StyleSheet, Text, View } from 'react-native';

import MainSpendDisplay from '@/components/MainSpendDisplay.1';
import { HomePageStats } from '@/lib/Types';

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
  const r = 125
const pad = 10
  const dim = (pad + r) * 2
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <MainSpendDisplay
        radius={125} 
        stats={stats}
      />  
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

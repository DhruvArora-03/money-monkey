import Button from '@components/Button';
import { exchangePublicToken, getLinkToken } from '@lib/Api';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinkIOSPresentationStyle, create, open } from 'react-native-plaid-link-sdk';

export default function ExpensesScreen() {
  const [readyToLink, setReadyToLink] = useState(false)

  useEffect(() => {
    if (readyToLink === false) {
      getLinkToken()
        .then(({ linkToken }) => create({ token: linkToken }))
        .then(() => setReadyToLink(true))
        .catch((err) => console.log('error trying to create link token: %s', err))
    }
  }, [readyToLink])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      <Button
        title='Open Link'
        color='blue'
        disabled={!readyToLink}
        onPress={() => open({
          onSuccess: ({ publicToken }) => {
            console.log('public token: %s', publicToken)
            setReadyToLink(false)
            exchangePublicToken(publicToken)
              .then(() => console.log('successfully exchanged'))
              .catch((err) => console.log('error trying to exchange public token: %s', err))
          },
          onExit: ({ error }) => {
            console.log('error message: %s', error?.errorMessage ?? 'none')
            setReadyToLink(false)
          },
          iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
        })}
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
});

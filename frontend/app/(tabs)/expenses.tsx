import Button from '@components/Button';
import { exchangePublicToken, getLinkToken } from '@lib/Api';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinkExit, LinkExitMetadataStatus, LinkLogLevel, LinkOpenProps, LinkSuccess, create, dismissLink, open } from 'react-native-plaid-link-sdk';

export default function ExpensesScreen() {
  const [readyToLink, setReadyToLink] = useState(false)

  useEffect(() => {
    if (readyToLink === false) {
      getLinkToken()
        .then(({ linkToken }) => create({ token: linkToken }))
        .then(() => setReadyToLink(true))
        .catch(console.log)
    }
  }, [readyToLink])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      <Button
        title="Open Link"
        color='blue'
        disabled={!readyToLink}
        onPress={() => {
          const openProps = {
            onSuccess: (success: LinkSuccess) => {
              console.log('success2')
              console.log(success)
              setReadyToLink(false)
              exchangePublicToken(success.publicToken).then(() => console.log('done!')).catch(console.log)
            },
            onExit: (exit: LinkExit) => {
              console.log('exit2')
              console.log(exit)
              setReadyToLink(false)
            },
            logLevel: LinkLogLevel.DEBUG,
          } satisfies LinkOpenProps
          open(openProps)
        }}
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

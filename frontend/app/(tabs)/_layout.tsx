import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import Colors from '@lib/Colors';
import { useClientOnlyValue } from '@components/useClientOnlyValue';
import { checkAuth, logOut } from '@lib/Api';
import Button from '@components/Button';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  useEffect(() => {
    checkAuth().then((ok) => !ok && router.replace('/'))
  }, [])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.theme.tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <Button
              style={styles.button}
              title='Log Out'
              color='red'
              onPress={() => logOut().then(() => router.replace('/'))}
            />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors.theme.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 15,
  },
  button: {
    padding: 5,
  },
});
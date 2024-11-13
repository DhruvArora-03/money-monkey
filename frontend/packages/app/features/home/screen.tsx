import { Session } from '@supabase/supabase-js'
import { H1, Text } from 'app/design/typography'
import { View } from 'app/design/view'
import GoogleSignInButton from 'app/features/auth/GoogleSignInButton'
import SignOutButton from 'app/features/auth/SignOutButton'
import CategoryDonutChart from 'app/features/dashboard/CategoryDonutChart'
import { supabase } from 'app/features/supabase'
import { useEffect, useState } from 'react'

export function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  return (
    <View className="flex-1 p-3">
      <H1>Dashboard</H1>
      <CategoryDonutChart />
      <GoogleSignInButton />
      {session && session.user && <Text>{session.user.id}</Text>}
      <SignOutButton />
    </View>
  )
}

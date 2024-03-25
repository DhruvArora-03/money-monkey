import { Auth, signOut } from 'firebase/auth'

export default function SignOutButton({ auth }: { auth: Auth }) {
  const signOutFn = () =>
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(console.log)

  return <button onClick={signOutFn}>Sign out</button>
}

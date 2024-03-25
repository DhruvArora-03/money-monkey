import { Auth, signOut } from 'firebase/auth'

type SignOutButtonProps = {
  auth: Auth
  className: string | undefined
}

export default function SignOutButton({ auth, className }: SignOutButtonProps) {
  const signOutFn = () =>
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(console.log)

  return (
    <button className={className} onClick={signOutFn}>
      Sign out
    </button>
  )
}

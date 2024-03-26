import { getAuth, signOut } from 'firebase/auth'
import styles from './signOutButton.module.css'
import clsx from 'clsx'

type SignOutButtonProps = {
  className?: string
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  const auth = getAuth()
  const signOutFn = () =>
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(console.log)

  return (
    <button className={clsx(className, styles.button)} onClick={signOutFn}>
      Sign out
    </button>
  )
}

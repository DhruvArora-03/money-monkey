import { getAuth } from 'firebase/auth'
import SignInButton from 'src/components/SignInButton'
import styles from './login.module.css'

export default function LoginPage() {
  const auth = getAuth()

  return (
    <div className={styles.page}>
      <SignInButton className={styles.button} auth={auth} />
    </div>
  )
}

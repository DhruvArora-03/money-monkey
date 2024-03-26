import SignInButton from 'src/components/SignInButton'
import styles from './login.module.css'

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <SignInButton className={styles.button} />
    </div>
  )
}

import SignOutButton from 'src/components/SignOutButton'
import styles from './home.module.css'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div>this is the home page</div>
      <SignOutButton />
    </div>
  )
}

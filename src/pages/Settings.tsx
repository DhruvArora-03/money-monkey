import { NavBar } from '@components'
import styles from './settings.module.css'

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <h1>Settings</h1>
      <NavBar />
    </div>
  )
}

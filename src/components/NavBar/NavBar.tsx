import styles from './navBar.module.css'
import { MdAdd, MdBlock, MdHome, MdSettings } from 'react-icons/md'

export default function NavBar() {
  return (
    <div className={styles.navbar}>
      <button className={styles.normalButton}>
        <MdHome size={22} />
      </button>
      <button className={styles.normalButton}>
        <MdBlock size={20} />
      </button>
      <button className={styles.addButton} onClick={() => alert('bruh')}>
        <MdAdd size={20} />
      </button>
      <button className={styles.normalButton}>
        <MdBlock size={22} />
      </button>
      <button className={styles.normalButton}>
        <MdSettings size={25} />
      </button>
    </div>
  )
}

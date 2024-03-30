import { useNavigate } from 'react-router-dom'
import styles from './navBar.module.css'
import { MdAdd, MdBlock, MdHome, MdSettings } from 'react-icons/md'

export default function NavBar() {
  const navigate = useNavigate()

  return (
    <div className={styles.navbar}>
      <button className={styles.normalButton} onClick={() => navigate('/')}>
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
      <button
        className={styles.normalButton}
        onClick={() => navigate('/settings')}
      >
        <MdSettings size={25} />
      </button>
    </div>
  )
}

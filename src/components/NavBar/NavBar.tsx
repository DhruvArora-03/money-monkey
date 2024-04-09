import { useNavigate } from 'react-router-dom'
import styles from './navBar.module.css'
import { MdAdd, MdBlock, MdHome, MdSettings } from 'react-icons/md'

type NavBarProps = {
  onAddClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function NavBar(props: NavBarProps) {
  const navigate = useNavigate()

  return (
    <div className={styles.navbar}>
      <button className={styles.normalButton} onClick={() => navigate('/')}>
        <MdHome size={22} />
      </button>
      <button className={styles.normalButton}>
        <MdBlock size={20} />
      </button>
      <button className={styles.addButton} onClick={props.onAddClick}>
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

import { TextInput } from '@components'
import styles from './createExpensePopup.module.css'
import { MdClose } from 'react-icons/md'
import { useState } from 'react'

type CreateExpensePopupProps = {
  onClose?: React.MouseEventHandler<HTMLButtonElement>
}

export default function CreateExpensePopup(props: CreateExpensePopupProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  return (
    <div className={styles.popup}>
      <h3>Create Expense</h3>
      <button className={styles.closeButton} onClick={props.onClose}>
        <MdClose size={20} />
      </button>
      <div className={styles.inputs}>
        <TextInput label='Name' value={name} setValue={setName} />
        <TextInput label='Amount' value={amount} setValue={setAmount} />
      </div>
    </div>

  )
}

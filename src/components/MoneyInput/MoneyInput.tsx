import { useState } from 'react'
import { formatMoney } from '@lib/money'
import styles from './moneyInput.module.css'

type MoneyInputProps = {
  label: string
  value: string
  setValue: (newValue: string) => void
}

export default function MoneyInput(props: MoneyInputProps) {
  const [focused, setFocused] = useState(false)

  console.log(props)

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={props.label}>
        {props.label}:
      </label>
      <input
        id={props.label}
        value={!props.value ? '' : focused ? props.value : formatMoney(+props.value * 100)}
        onChange={(e) => props.setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={styles.input}
      />
    </div>
  )
}


/*
 *
 * onFocus --> change to just number
 * onUnfocus --> change to formatted
 *
 *
 *
 *
 *
 */

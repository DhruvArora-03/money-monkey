import { formatMoney } from '@lib/money'
import { useState } from 'react'
import styles from './moneyInput.module.css'
import clsx from 'clsx'

type MoneyInputProps = {
  id: string
  className?: string
  value: string
  setValue: (newValue: string) => void
}

export default function MoneyInput(props: MoneyInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      id={props.id}
      className={clsx(styles.input, props.className)}
      value={
        !props.value
          ? ''
          : focused
            ? props.value
            : formatMoney(+props.value * 100)
      }
      onChange={(e) => props.setValue(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

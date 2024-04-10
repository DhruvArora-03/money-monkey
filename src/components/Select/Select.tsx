import { Dispatch, SetStateAction } from 'react'
import styles from './select.module.css'

type SelectProps = {
  options: (string | number)[]
  value: number | undefined
  setValue: Dispatch<SetStateAction<number>> | Dispatch<SetStateAction<number | undefined>>
}

export default function Select(props: SelectProps) {
  return (
    <select
      className={styles.select}
      value={props.value}
      onChange={(e) => props.setValue(+e.target.value)}
    >
      {props.options.map((label, i) => (
        <option key={label} value={i}>
          {label}
        </option>
      ))}
    </select>
  )
}

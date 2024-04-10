import { Dispatch, SetStateAction } from 'react'
import styles from './select.module.css'
import clsx from 'clsx'

type SelectProps = {
  id?: string
  className?: string
  options: (string | number)[]
  value: number | undefined
  setValue:
    | Dispatch<SetStateAction<number>>
    | Dispatch<SetStateAction<number | undefined>>
}

export default function Select(props: SelectProps) {
  return (
    <select
      id={props.id}
      className={clsx(props.className, styles.select)}
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

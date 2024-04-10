import clsx from 'clsx'
import styles from './dateInput.module.css'

type DateInputProps = {
  id: string
  className?: string
  value: string
  setValue: (newValue: string) => void
}

export default function DateInput(props: DateInputProps) {
  return (
    <input
      id={props.id}
      className={clsx(styles.input, props.className)}
      type="date"
      value={props.value}
      onChange={(e) => props.setValue(e.target.value)}
    />
  )
}

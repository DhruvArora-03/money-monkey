import clsx from 'clsx'
import styles from './textInput.module.css'

type TextInputProps = {
  id: string
  className?: string
  value: string
  setValue: (newValue: string) => void
}

export default function TextInput(props: TextInputProps) {
  return (
    <input
      id={props.id}
      className={clsx(styles.input, props.className)}
      value={props.value}
      onChange={(e) => props.setValue(e.target.value)}
    />
  )
}

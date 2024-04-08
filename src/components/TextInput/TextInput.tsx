import styles from './textInput.module.css'

type TextInputProps = {
  label: string
  value: string
  setValue: (newValue: string) => void
}

export default function TextInput(props: TextInputProps) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={props.label}>
        {props.label}:
      </label>
      <input
        id={props.label}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        className={styles.input}
      />
    </div>
  )
}

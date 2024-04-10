import styles from './dateInput.module.css'

type DateInputProps = {
  label: string
  value: string
  setValue: (newValue: string) => void
}

export default function DateInput(props: DateInputProps) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={props.label}>
        {props.label}:
      </label>
      <input
        id={props.label}
        type="date"
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        className={styles.input}
      />
    </div>
  )
}


import { SetStateAction } from 'react'

type SelectProps<T> = {
  options: string[]
  value: T
  setValue: SetStateAction<T>
}

export default function Select<T>(props: SelectProps<T>) {
  return (
    <select>
      {props.options.map((label, i) => (
        <option key={label} value={i} onChange={(e) => console.log(e)}>
          {label}
        </option>
      ))}
    </select>
  )
}

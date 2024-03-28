import { Dispatch, SetStateAction } from 'react'

type SelectProps = {
  options: (string | number)[]
  value: number
  setValue: Dispatch<SetStateAction<number>>
}

export default function Select(props: SelectProps) {
  console.log(props)
  return (
    <select
      value={props.value}
      onChange={(e) => props.setValue(+e.target.value)}
    >
      {props.options.map((label, i) => (
        <option key={label} value={i} onChange={(e) => console.log(e)}>
          {label}
        </option>
      ))}
    </select>
  )
}

import { formatMoney } from '@lib/money'
import { useState } from 'react'
import styles from './moneyField.module.css'
import clsx from 'clsx'
import { FieldProps } from 'formik'

type MoneyFieldProps = FieldProps & {
  id?: string
  className?: string
}

export default function MoneyField({
  field: { onBlur: formikOnBlur, value: formikValue, ...field },
  ...props
}: MoneyFieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      id={props.id}
      className={clsx(styles.input, props.className)}
      value={focused ? formikValue : formatMoney(+formikValue * 100)}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false)
        formikOnBlur
      }}
      {...field}
    />
  )
}

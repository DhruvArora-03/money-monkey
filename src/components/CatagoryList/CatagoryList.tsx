import { Cell } from '@components'
import styles from './catagoryList.module.css'
import clsx from 'clsx'

type CatagoryListProps = {
  className?: string
}

export default function CatagoryList(props: CatagoryListProps) {
  return (
    <div className={clsx(props.className, styles.list)}>
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
      <Cell label="Food" amountCents={31219} />
      <Cell label="Rent" amountCents={120000} />
      <Cell label="Utilities" amountCents={10514} />
      <Cell label="Entertainment" amountCents={3750} />
      <Cell label="Miscellanous" amountCents={6482} />
    </div>
  )
}

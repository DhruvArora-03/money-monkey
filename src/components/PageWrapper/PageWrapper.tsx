import { CreateExpensePopup, NavBar } from '@components'
import { useState } from 'react'

type PageWrapperProps = {
  children: React.ReactNode
  className?: string
}

export default function PageWrapper(props: PageWrapperProps) {
  const [visible, setVisible] = useState(false)

  return <div className={props.className}>
    {props.children}
    <NavBar onAddClick={() => setVisible(true)} />
    {visible && <CreateExpensePopup onClose={() => setVisible(false)} />
    }  </div>
}

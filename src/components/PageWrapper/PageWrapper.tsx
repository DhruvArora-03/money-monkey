import { CreateExpensePopup, NavBar } from '@components'
import { useState } from 'react'

type PageWrapperProps = {
  children: React.ReactNode
  className?: string
}

export default function PageWrapper(props: PageWrapperProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={props.className}>
      {props.children}
      <NavBar
        onAddClick={() => {
          setVisible(true)
          document.getElementsByTagName('body')[0].style.overflow = 'hidden' // disables scrolling
        }}
      />
      {visible && (
        <CreateExpensePopup
          onClose={(e) => {
            e.preventDefault()
            setVisible(false)
            document.getElementsByTagName('body')[0].style.overflow = 'unset'
          }}
        />
      )}
    </div>
  )
}

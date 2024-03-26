import { GoogleLogin } from '@react-oauth/google'
import clsx from 'clsx'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth'
import { useState } from 'react'
import styles from './signInButton.module.css'

type SignInButtonProps = {
  className?: string
}

export default function SignInButton({ className }: SignInButtonProps) {
  const [showButton, setShowButton] = useState(false)
  const auth = getAuth()

  return (
    <div className={clsx(!showButton && styles.hidden, className)}>
      <GoogleLogin
        onSuccess={(res) => {
          signInWithCredential(
            auth,
            GoogleAuthProvider.credential(res.credential),
          )
        }}
        onError={() => console.log('error in signIn button')}
        promptMomentNotification={(promptMomentNotification) => {
          setShowButton(!promptMomentNotification.isDisplayed())
        }}
        auto_select
        useOneTap
      />
    </div>
  )
}

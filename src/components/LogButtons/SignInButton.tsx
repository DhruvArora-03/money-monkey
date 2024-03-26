import { GoogleLogin } from '@react-oauth/google'
import clsx from 'clsx'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth'
// import { useState } from 'react'
import styles from './signInButton.module.css'
import { useNavigate } from 'react-router-dom'

type SignInButtonProps = {
  className?: string
}

export default function SignInButton({ className }: SignInButtonProps) {
  const navigate = useNavigate()
  // const [showButton, setShowButton] = useState(false)
  const auth = getAuth()

  console.log('sign innnnnn')

  return (
    <div className={clsx(false && styles.hidden, className)}>
      <GoogleLogin
        onSuccess={(res) => {
          signInWithCredential(
            auth,
            GoogleAuthProvider.credential(res.credential),
          ).then(() => navigate('/'))
        }}
        onError={() => console.log('error in signIn button')}
        // promptMomentNotification={(promptMomentNotification) => {
        // setShowButton(!promptMomentNotification.isDisplayed())
        // }}
        // useOneTap
        // use_fedcm_for_prompt
      />
    </div>
  )
}

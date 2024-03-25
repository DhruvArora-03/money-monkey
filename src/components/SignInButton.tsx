import { GoogleLogin } from '@react-oauth/google'
import { Auth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { useState } from 'react'

type SignInButtonProps = {
  auth: Auth
  className: string | undefined
}

export default function SignInButton({ auth, className }: SignInButtonProps) {
  const [showButton, setShowButton] = useState(false)

  return (
    <div style={{ display: showButton ? '' : 'none' }} className={className}>
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

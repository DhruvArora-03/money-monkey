import { GoogleLogin } from '@react-oauth/google'
import clsx from 'clsx'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth'
import styles from './signInButton.module.css'
import { useNavigate } from 'react-router-dom'

type SignInButtonProps = {
  className?: string
}

export default function SignInButton({ className }: SignInButtonProps) {
  const navigate = useNavigate()
  const auth = getAuth()

  return (
    <div className={clsx(styles.button, className)}>
      <GoogleLogin
        onSuccess={(res) => {
          signInWithCredential(
            auth,
            GoogleAuthProvider.credential(res.credential),
          ).then(() => navigate('/'))
        }}
        onError={() => console.log('error in signIn button')}
      />
    </div>
  )
}

import { getAuth } from 'firebase/auth'
import SignInButton from 'src/components/SignInButton'
import './login.css'

export default function LoginPage() {
  const auth = getAuth()

  return (
    <div className="page">
      <SignInButton className="button" auth={auth} />
    </div>
  )
}

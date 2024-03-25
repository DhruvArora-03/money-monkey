import { getAuth } from 'firebase/auth'
import SignInButton from 'src/components/SignInButton'

export default function LoginPage() {
  const auth = getAuth()

  return <SignInButton auth={auth} />
}

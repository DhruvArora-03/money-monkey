import { getAuth } from 'firebase/auth'
import SignOutButton from 'src/components/SignOutButton'

export default function HomePage() {
  const auth = getAuth()

  return (
    <div>
      this is the home page
      <SignOutButton auth={auth} />
    </div>
  )
}

import { Auth, signOut } from 'firebase/auth'

export default function SignOutButton({ auth }: { auth: Auth }) {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch(console.log)
}

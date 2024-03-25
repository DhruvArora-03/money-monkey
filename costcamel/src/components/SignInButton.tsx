import {
  Auth,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { useMemo } from 'react'
import { redirect } from 'react-router-dom'

export default function SignInButton({ auth }: { auth: Auth }) {
  const provider = useMemo(() => new GoogleAuthProvider(), [])
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential?.accessToken
        // The signed-in user info.
        const user = result.user
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(token)
        console.log(user)
        console.log(getAdditionalUserInfo(result))
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
        console.warn(errorCode)
        console.warn(errorMessage)
        console.warn(email)
        console.warn(credential)
      })
      .then(() => redirect('/bruh'))
  }
  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  )
}

import HomePage from '@pages/Home'
import LoginPage from '@pages/Login'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate, Route, Routes } from 'react-router-dom'

const firebaseConfig = {
  apiKey: 'AIzaSyADet9ooqhq2lZuX0K9i8DDawu_kW9sZso',
  authDomain: 'dhruv-budget-app.firebaseapp.com',
  projectId: 'dhruv-budget-app',
  storageBucket: 'dhruv-budget-app.appspot.com',
  messagingSenderId: '616520665199',
  appId: '1:616520665199:web:b1977d2a42d884f1a6e59a',
  measurementId: 'G-4GPLMLQZ1J',
}

// Initialize Firebase
initializeApp(firebaseConfig)

type AuthWrapperProps = { user: User | null | undefined; children: JSX.Element }

const Authed = (props: AuthWrapperProps) =>
  props.user ? props.children : <Navigate replace to="/login" />

const UnAuthed = (props: AuthWrapperProps) =>
  props.user ? <Navigate replace to="/" /> : props.children

function App() {
  let auth = getAuth()
  const [user] = useAuthState(auth)

  onAuthStateChanged(auth, () => {
    auth = getAuth()
  })

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Authed user={user}>
            <HomePage />
          </Authed>
        }
      />
      <Route
        path="/login"
        element={
          <UnAuthed user={user}>
            <LoginPage />
          </UnAuthed>
        }
      />
    </Routes>
  )
}

export default App

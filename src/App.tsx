import HomePage from '@pages/Home'
import LoginPage from '@pages/Login'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
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

function App() {
  const auth = getAuth()
  const [user] = useAuthState(auth)

  const Authed = (props: { children: JSX.Element }) =>
    user ? props.children : <Navigate replace to="/login" />

  const UnAuthed = (props: { children: JSX.Element }) =>
    user ? <Navigate replace to="/" /> : props.children

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Authed>
              <HomePage />
            </Authed>
          }
        />
        <Route
          path="/login"
          element={
            <UnAuthed>
              <LoginPage />
            </UnAuthed>
          }
        />
      </Routes>
    </div>
  )
}

export default App

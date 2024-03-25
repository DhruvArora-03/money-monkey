import HomePage from '@pages/Home'
import LoginPage from '@pages/Login'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate, Route, Routes } from 'react-router-dom'

const firebaseConfig = {
  apiKey: 'AIzaSyD7ZV1Z3WWLjK9zjgnPbogZeIS9Bq6xJJI',
  authDomain: 'costcamel-b6c02.firebaseapp.com',
  projectId: 'costcamel-b6c02',
  storageBucket: 'costcamel-b6c02.appspot.com',
  messagingSenderId: '725109949838',
  appId: '1:725109949838:web:432a3cce60d9c78fe8d0df',
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

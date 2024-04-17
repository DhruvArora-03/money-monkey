import HomePage from '@pages/Home'
import LoginPage from '@pages/Login'
import SettingsPage from '@pages/Settings'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  const auth = getAuth()
  const [user] = useAuthState(auth)

  return (
    <Routes>
      {user ? (
        // authed routes:
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<div>error</div>} />
        </>
      ) : (
        // unauthed routes:
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  )
}

export default App

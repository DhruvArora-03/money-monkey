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

  return (
    <Routes>
      {user ? (
        // authed routes:
        <>
          <Route path="/" element={<HomePage />} />
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
// import React from 'react'
// import Circle, { CircleSection } from './components/Circle/Circle'

// // Usage example
// const App: React.FC = () => {
//   const sections: CircleSection[] = [
//     { type: 'Housing', percentage: 40 },
//     { type: 'Food', percentage: 15 },
//     { type: 'Entertainment', percentage: 10 },
//     { type: 'Clothes', percentage: 10 },
//     { type: 'Groceries', percentage: 25 },
//   ]

//   return (
//     <div
//       style={{
//         backgroundColor: '#202031',
//         color: 'black',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         // width: 'fit-content',
//         padding: 10,
//       }}
//     >
//       <Circle sections={sections} radius={300} />
//     </div>
//   )
// }

// export default App

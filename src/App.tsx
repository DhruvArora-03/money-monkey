// import HomePage from '@pages/Home'
// import LoginPage from '@pages/Login'
// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'
// import { useAuthState } from 'react-firebase-hooks/auth'
// import { Navigate, Route, Routes } from 'react-router-dom'

// const firebaseConfig = {
//   apiKey: 'AIzaSyADet9ooqhq2lZuX0K9i8DDawu_kW9sZso',
//   authDomain: 'dhruv-budget-app.firebaseapp.com',
//   projectId: 'dhruv-budget-app',
//   storageBucket: 'dhruv-budget-app.appspot.com',
//   messagingSenderId: '616520665199',
//   appId: '1:616520665199:web:b1977d2a42d884f1a6e59a',
//   measurementId: 'G-4GPLMLQZ1J',
// }

// // Initialize Firebase
// initializeApp(firebaseConfig)

// function App() {
//   const auth = getAuth()
//   const [user] = useAuthState(auth)

//   return (
//     <Routes>
//       {user ? (
//         // authed routes:
//         <>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<Navigate to="/" />} />
//           <Route path="*" element={<div>error</div>} />
//         </>
//       ) : (
//         // unauthed routes:
//         <>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </>
//       )}
//     </Routes>
//   )
// }

// export default App
import React from 'react'

// interface CircleSection {
//   color: string
//   percentage: number
// }

// interface CircleProps {
//   sections: CircleSection[]
//   radius: number
// }

// const Circle: React.FC<CircleProps> = ({ sections, radius }) => {
//   // const circumference = 2 * Math.PI * radius
//   let prevPercentage = 0

//   return (
//     <svg width={radius * 2} height={radius * 2}>
//       {sections.map((section, index) => {
//         const percentage = section.percentage
//         // const pathLength = (percentage / 100) * circumference
//         const d = `
//           M ${radius},${radius}
//           L ${radius},${0}
//           A ${radius},${radius} 0 ${percentage > 50 ? 1 : 0},1
//           ${radius + Math.cos((2 * Math.PI * (prevPercentage + percentage / 2)) / 360) * radius},
//           ${radius + Math.sin((2 * Math.PI * (prevPercentage + percentage / 2)) / 360) * radius}
//         `
//         prevPercentage += percentage

//         return <path key={index} d={d} stroke={section.color} fill="none" />
//       })}
//     </svg>
//   )
// }

// Usage example
const App: React.FC = () => {
  // const sections: CircleSection[] = [
  //   { color: 'red', percentage: 30 },
  //   { color: 'blue', percentage: 20 },
  //   { color: 'green', percentage: 45 },
  // ]

  return (
    <div
      style={{
        backgroundColor: 'lightblue',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'fit-content',
      }}
    >
      {/* <Circle sections={sections} radius={50} /> */}
      test
      <svg width={500} height={500}>
        <path
          d={`M 250 250
              A 100 100 0 0 0 
              ${100 + Math.cos((2 * Math.PI * (0 + 50 / 2)) / 360) * 100} 
              ${100 + Math.sin((2 * Math.PI * (0 + 50 / 2)) / 360) * 100}
              `}
          stroke="green"
          strokeWidth={4}
          fill="none"
        />
      </svg>
    </div>
  )
}

export default App

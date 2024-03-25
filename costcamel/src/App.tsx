import HomePage from '@pages/Home';
import LoginPage from '@pages/Login';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Route, Routes } from 'react-router-dom';

const firebaseConfig = {
  apiKey: 'AIzaSyD7ZV1Z3WWLjK9zjgnPbogZeIS9Bq6xJJI',
  authDomain: 'costcamel-b6c02.firebaseapp.com',
  projectId: 'costcamel-b6c02',
  storageBucket: 'costcamel-b6c02.appspot.com',
  messagingSenderId: '725109949838',
  appId: '1:725109949838:web:432a3cce60d9c78fe8d0df',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firebase = getFirestore(app);

type ProtectedRouteProps = {
  children: JSX.Element;
};

function App() {
  const [user] = useAuthState(auth);

  const Protected = (props: ProtectedRouteProps) =>
    user ? props.children : <Navigate replace to="/login" />;

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <HomePage />
            </Protected>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;

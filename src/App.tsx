import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

// This is a placeholder for real authentication logic from Supabase
const useAuth = () => {
  // For now, we'll just hardcode this to false to simulate a logged-out user.
  const isAuthenticated = false;
  return isAuthenticated;
};

const AdminDashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Admin Dashboard</h2>
    <p>Welcome to the blog management page.</p>
  </div>
);

function App() {
  const isAuthenticated = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      {/* Redirect any other path to the main page logic */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

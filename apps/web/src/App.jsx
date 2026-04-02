/**
 * App — Root component with routes
 *
 * PUBLIC ROUTES:  /login, /register (anyone can access)
 * PROTECTED:      /dashboard (redirect to /login if not authenticated)
 *
 * Day 6: Add DashboardLayout, Overview, Settings
 * Day 26: Add marketing pages (/, /pricing)
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Placeholder — replaced on Day 6 with real dashboard
function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-4">Welcome, {user?.name}!</p>
        <p className="text-sm text-gray-400 mb-6">Plan: {user?.plan}</p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Shows loading spinner while checking if user has a valid session
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  // Wait until initial auth check completes
  if (loading) return <LoadingScreen />;

  return (
    <>
      {/* Toast notifications — shows at top-right of screen */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <Routes>
        {/* Auth pages — redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Dashboard — redirect to login if not authenticated */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={user ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </>
  );
}
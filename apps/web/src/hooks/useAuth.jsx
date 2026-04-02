/**
 * Auth Context — provides user, login, logout, loading to all pages
 *
 * WHAT:  Wraps the app with auth state. Any component can access:
 *        const { user, login, logout, loading } = useAuth();
 *
 * HOW IT WORKS:
 *   1. App loads → tries POST /auth/refresh (browser sends cookie)
 *   2. If refresh succeeds → user is logged in (JWT + user data stored)
 *   3. If refresh fails → user is not logged in (show login page)
 *   4. login() → POST /auth/login → store JWT + user
 *   5. logout() → POST /auth/logout → clear everything
 *
 * READ:  import { useAuth } from '../hooks/useAuth';
 *        const { user, login, logout, loading } = useAuth();
 *
 * WHERE: Wrap your app in main.jsx:
 *        <AuthProvider><App /></AuthProvider>
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api, { setToken, clearToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True until initial check completes

  // On app load: try to refresh (checks if user has a valid session)
  useEffect(() => {
    api.post('/auth/refresh')
      .then((res) => {
        setToken(res.data.token);
        setUser(res.data.user);
      })
      .catch(() => {
        // No valid session — that's fine, user needs to log in
      })
      .finally(() => setLoading(false));
  }, []);

  // Login: send credentials → store JWT + user
  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }

  // Logout: clear cookie + JWT + user state
  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if API call fails, clear local state
    }
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for components to access auth state
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
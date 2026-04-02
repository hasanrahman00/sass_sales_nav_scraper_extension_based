/**
 * Login Page
 *
 * WHAT:  Email + password form. On success → redirect to dashboard.
 * WHERE: Route: /login
 *
 * FLOW:
 *   1. User types email + password
 *   2. Clicks "Sign in" → button shows "Signing in..."
 *   3. Calls login() from useAuth (which calls POST /auth/login)
 *   4. Success → redirects to /dashboard
 *   5. Error → toast shows the error message
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      // Show field-level errors or general error message
      const error = err.response?.data?.error;
      if (error?.details) {
        // Validation errors — show first one
        const firstField = Object.keys(error.details)[0];
        toast.error(error.details[firstField]);
      } else {
        toast.error(error?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Sign in to VikiLeads
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium
                       rounded-lg hover:bg-indigo-700 disabled:opacity-50
                       disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
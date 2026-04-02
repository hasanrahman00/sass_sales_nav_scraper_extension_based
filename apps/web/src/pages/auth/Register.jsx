/**
 * Register Page
 *
 * WHAT:  Name + email + password form. On success → redirect to login.
 * WHERE: Route: /register
 *
 * WHY REDIRECT TO LOGIN (not auto-login):
 *   Registration returns { user } without a JWT.
 *   User needs to login separately to get their JWT + refresh cookie.
 *   This is simpler and matches most SaaS flows (Notion, Linear, etc.)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const error = err.response?.data?.error;
      if (error?.details) {
        const firstField = Object.keys(error.details)[0];
        toast.error(error.details[firstField]);
      } else {
        toast.error(error?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Start generating leads in minutes
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
              required
            />
          </div>

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
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium
                       rounded-lg hover:bg-indigo-700 disabled:opacity-50
                       disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
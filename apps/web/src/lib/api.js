/**
 * Axios API Client — with silent refresh on 401
 *
 * WHAT:  Pre-configured Axios instance that all pages use.
 *        When a request gets 401 (JWT expired), it automatically
 *        calls POST /auth/refresh, gets a new JWT, and retries.
 *
 * READ:  import api from '../lib/api';
 *        const res = await api.get('/auth/me');
 *        const res = await api.post('/auth/login', { email, password });
 *
 * HOW REFRESH WORKS:
 *   1. Request gets 401 → interceptor catches it
 *   2. Calls POST /auth/refresh (browser sends httpOnly cookie automatically)
 *   3. Server returns new JWT → interceptor stores it
 *   4. Original request retried with new JWT → succeeds
 *
 * PROMISE LOCK:
 *   If 3 requests all get 401 at the same time, only ONE refresh call
 *   happens. The other 2 wait for it to finish, then retry with the new JWT.
 *   Without the lock: 3 refresh calls → only 1 works (rotation deletes the others).
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Send httpOnly cookies with every request
});

// ─── JWT stored in memory (not localStorage — more secure) ───
let accessToken = null;

export function setToken(token) { accessToken = token; }
export function getToken() { return accessToken; }
export function clearToken() { accessToken = null; }

// ─── Request interceptor: attach JWT to every request ───
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── Response interceptor: refresh on 401 ───
let refreshPromise = null; // Promise lock — only one refresh at a time

api.interceptors.response.use(
  // Success — pass through
  (response) => response,

  // Error — check if 401 and try to refresh
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh or login endpoints (infinite loop)
    const skipPaths = ['/auth/refresh', '/auth/login', '/auth/register'];
    if (!error.response || error.response.status !== 401 || skipPaths.includes(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Already retried this request? Don't loop.
    if (originalRequest._retried) {
      return Promise.reject(error);
    }
    originalRequest._retried = true;

    // Only one refresh at a time (promise lock)
    if (!refreshPromise) {
      refreshPromise = api.post('/auth/refresh')
        .then((res) => {
          setToken(res.data.token);
          return res.data.token;
        })
        .catch((err) => {
          clearToken(); // Refresh failed — user must re-login
          return Promise.reject(err);
        })
        .finally(() => {
          refreshPromise = null; // Unlock for future refreshes
        });
    }

    // Wait for the refresh to complete, then retry original request
    try {
      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }
);

export default api;
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

function HomePage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">VikiLeads</h1>
        <p className="text-gray-500 mb-6">B2B Lead Generation</p>
        <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
          <p className="font-mono text-gray-600 mb-2">API Health:</p>
          {health && <p className="text-green-600">✓ {health.status} · uptime {health.uptime}s</p>}
          {error && <p className="text-red-500">✗ {error}</p>}
          {!health && !error && <p className="text-gray-400">Checking...</p>}
        </div>
        <p className="text-xs text-gray-400 mt-6">Day 1 complete. Auth pages Day 5.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

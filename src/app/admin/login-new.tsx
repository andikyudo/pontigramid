'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login attempt:', { email, password });
    
    // Simple validation
    if (email === 'admin@pontigramid.com' && password === 'admin123') {
      setLoading(true);
      setMessage('Login berhasil! Mengalihkan...');
      
      console.log('Credentials valid, setting token...');
      
      // Set token
      localStorage.setItem('admin_token', 'token-' + Date.now());
      localStorage.setItem('admin_user', JSON.stringify({
        email: 'admin@pontigramid.com',
        name: 'Admin User',
        role: 'admin'
      }));
      
      console.log('Token set, redirecting to dashboard...');
      
      // Redirect
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 500);
      
    } else {
      setMessage('Email atau password salah!');
    }
  };

  const handleDirectLogin = () => {
    console.log('Direct login clicked');
    
    // Set token immediately
    localStorage.setItem('admin_token', 'direct-token-' + Date.now());
    localStorage.setItem('admin_user', JSON.stringify({
      email: 'admin@pontigramid.com',
      name: 'Admin User',
      role: 'admin'
    }));
    
    console.log('Direct token set, redirecting...');
    
    // Immediate redirect
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login - NEW</h1>
          <p className="text-gray-600 mt-2">Halaman login yang bersih</p>
        </div>

        {/* Direct Login Button */}
        <div className="mb-6">
          <button
            onClick={handleDirectLogin}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🚀 LANGSUNG MASUK (BYPASS)
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Klik untuk langsung masuk tanpa form
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500 mb-4">Atau login dengan form:</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@pontigramid.com"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin123"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('berhasil') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Demo: admin@pontigramid.com / admin123
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@pontigramid.com');
                setPassword('admin123');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm mt-1"
            >
              Isi otomatis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

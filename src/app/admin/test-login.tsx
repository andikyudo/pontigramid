'use client';

import { useState } from 'react';

export default function TestLogin() {
  const [email, setEmail] = useState('admin@pontigramid.com');
  const [password, setPassword] = useState('admin123');

  const handleTest = () => {
    console.log('Testing login logic...');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // EXACT SAME LOGIC AS MAIN LOGIN
    if (email === 'admin@pontigramid.com' && password === 'admin123') {
      console.log('✅ Credentials match! Should redirect...');
      
      // Set token
      localStorage.setItem('admin_token', 'test-token-' + Date.now());
      localStorage.setItem('admin_user', JSON.stringify({
        email: 'admin@pontigramid.com',
        name: 'Admin User',
        role: 'admin'
      }));
      
      console.log('✅ Token set! Redirecting...');
      
      // REDIRECT
      window.location.replace('/admin/dashboard');
      
      return;
    } else {
      console.log('❌ Credentials do not match');
      console.log('Expected: admin@pontigramid.com / admin123');
      console.log('Got:', email, '/', password);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Login Logic</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button
          onClick={handleTest}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Test Login Logic
        </button>
        
        <div className="text-sm text-gray-600">
          <p>Open Console (F12) to see logs</p>
          <p>Expected: Should redirect to dashboard if credentials are correct</p>
        </div>
      </div>
    </div>
  );
}

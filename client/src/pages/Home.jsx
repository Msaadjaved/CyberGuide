import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThreatGlobe from '../three/ThreatGlobe';

// Member 2 owns the styling and Three.js globe on this page
// Member 1 has wired up the login logic below

export default function Home() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      login(data.token, { username: data.username, role: data.role });
      navigate('/chat');
    } catch {
      setError('Could not reach the server. Is it running?');
    }
  };

  return (
    <div>
      {/* Three.js globe — Member 2 wires this in */}
      <ThreatGlobe />

      <h1>CyberGuide</h1>
      <p>Your step-by-step cybersecurity incident response coach.</p>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Log in and start</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <p style={{ fontSize: '12px', opacity: 0.5 }}>
        Demo — username: student / password: epita2025
      </p>
    </div>
  );
}

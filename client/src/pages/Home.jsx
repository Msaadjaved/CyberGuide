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
  const [loading, setLoading]   = useState(false); // ← ADD THIS LINE

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // ← ADD THIS
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false); // ← ADD THIS
        return;
      }
      login(data.token, { username: data.username, role: data.role });
      navigate('/chat');
    } catch {
      setError('Could not reach the server. Is it running?');
      setLoading(false); // ← ADD THIS
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      position: 'relative',
    }}>
      {/* Globe sits at the top */}
      <ThreatGlobe />

      {/* App title */}
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 700, 
        margin: '0 0 8px', 
        color: '#A6E3A1' 
      }}>
        CyberGuide
      </h1>
      <p style={{ 
        fontSize: '1rem', 
        color: '#888', 
        margin: '0 0 32px' 
      }}>
        Your step-by-step incident response coach
      </p>

      {/* Login card */}
      <form onSubmit={handleLogin} style={{
        background: '#12121f',
        border: '1px solid #2a2a4a',
        borderRadius: '12px',
        padding: '32px',
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            background: loading ? '#155a44' : '#1D9E75',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s ease',
          }}
        >
          {loading ? 'Logging in...' : 'Start incident response'}
        </button>
        {error && (
          <p style={{ 
            color: '#ff6b6b', 
            margin: 0, 
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {error}
          </p>
        )}
      </form>

      <p style={{ 
        marginTop: '16px', 
        fontSize: '11px', 
        color: '#444', 
        textAlign: 'center' 
      }}>
        Demo: student / epita2025
      </p>
    </div>
  );
}
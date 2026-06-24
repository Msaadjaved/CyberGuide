import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatBubble from '../components/ChatBubble';



export default function Chat() {
  const { token, logout } = useAuth(); // Added logout here
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // use existing session if exists , else create new one
  const SESSION_ID = localStorage.getItem('cg_session') || `session-${Date.now()}`;
  localStorage.setItem('cg_session', SESSION_ID);


  // Restore history when page loads
  useEffect(() => {
    if (!token) return;
    fetch(`/api/chat/history/${SESSION_ID}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.history && data.history.length > 0) {
          setMessages(data.history);
        }
      })
      .catch(() => {});
  }, [token]);


  // Redirect to login if no token
  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, sessionId: SESSION_ID }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Is the backend running?'
      }]);
    } finally {
      setLoading(false);
    }
  };


  const startNewChat = () => {
    localStorage.removeItem('cg_session');
    window.location.reload(); // reload generates a new session ID
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      height: '100vh',
      background: '#0a0a1a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
    }}>

      {/* Header bar */}
      <div style={{
        background: '#12121f',
        borderBottom: '1px solid #2a2a4a',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: '#A6E3A1', fontWeight: 700, fontSize: '18px' }}>
          CyberGuide
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/report')} style={{
            background: 'transparent', border: '1px solid #444',
            borderRadius: '6px', padding: '6px 14px',
            color: '#aaa', cursor: 'pointer', fontSize: '13px',
          }}>
            View report
          </button>
          <button onClick={startNewChat} style={{
            background: 'transparent', border: '1px solid #444',
            borderRadius: '6px', padding: '6px 14px',
            color: '#aaa', cursor: 'pointer', fontSize: '13px',
          }}>
            New convo
          </button>


          <button onClick={logout} style={{
            background: 'transparent', border: '1px solid #444',
            borderRadius: '6px', padding: '6px 14px',
            color: '#aaa', cursor: 'pointer', fontSize: '13px',
          }}>
            Log out
          </button>
        </div>
      </div>

      {/* Messages area — scrollable */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#555', textAlign: 'center', marginTop: '40px' }}>
            Describe your incident and CyberGuide will walk you through it.
          </p>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && <ChatBubble role='assistant' content='Thinking...' />}
        <div ref={bottomRef} />
      </div>

      {/* Input bar — stays at the bottom */}
      <div style={{
        background: '#12121f',
        borderTop: '1px solid #2a2a4a',
        padding: '14px 20px',
        display: 'flex',
        gap: '10px',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Describe what happened...'
          disabled={loading}
          style={{
            flex: 1, background: '#1a1a2e', border: '1px solid #333',
            borderRadius: '8px', padding: '10px 14px',
            color: '#fff', fontSize: '14px', outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background: loading ? '#444' : '#1D9E75',
            border: 'none', borderRadius: '8px',
            padding: '10px 20px', color: '#fff',
            fontWeight: 600, cursor: loading ? 'default' : 'pointer',
            fontSize: '14px', transition: 'background 0.2s',
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
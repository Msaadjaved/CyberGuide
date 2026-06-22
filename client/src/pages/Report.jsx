import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Member 2 owns the styling of this page
// The fetch and download logic is wired below

export default function Report() {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const [report, setReport]   = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Get the sessionId that was stored during the chat
  const sessionId = localStorage.getItem('cg_session') || '';

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    if (!sessionId) { setError('No session found. Go chat first.'); setLoading(false); return; }

    fetch(`/api/report/${sessionId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setReport(data.report || 'No report generated yet. Finish a chat session first.');
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load report.');
        setLoading(false);
      });
  }, [token, sessionId]);

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `incident-report-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading report...</p>;
  if (error)   return <p>{error}</p>;

  return (
    <div>
      <h1>Incident Report</h1>
      <button onClick={() => navigate('/chat')}>Back to chat</button>
      <button onClick={downloadReport}>Download report</button>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', marginTop: '20px' }}>
        {report}
      </pre>
    </div>
  );
}

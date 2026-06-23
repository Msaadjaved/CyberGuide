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

  if (loading) return (
    <div style={{ height:'100vh', background:'#0a0a1a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p style={{ color:'#555' }}>Loading report...</p>
    </div>
  );

  if (error) return (
    <div style={{ height:'100vh', background:'#0a0a1a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
      <p style={{ color:'#ff6b6b' }}>{error}</p>
      <button onClick={() => navigate('/chat')} style={{ background:'#1D9E75', border:'none', borderRadius:'8px', padding:'10px 20px', color:'#fff', cursor:'pointer' }}>
        Go to chat
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a1a', fontFamily:'Arial, sans-serif', color:'#ccc' }}>

      {/* Header */}
      <div style={{ background:'#12121f', borderBottom:'1px solid #2a2a4a', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:'#A6E3A1', fontWeight:700, fontSize:'18px' }}>CyberGuide</span>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={() => navigate('/chat')} style={{ background:'transparent', border:'1px solid #444', borderRadius:'6px', padding:'6px 14px', color:'#aaa', cursor:'pointer', fontSize:'13px' }}>
            Back to chat
          </button>
          <button onClick={downloadReport} style={{ background:'#1D9E75', border:'none', borderRadius:'6px', padding:'6px 14px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>
            Download report
          </button>
        </div>
      </div>

      {/* Report content */}
      <div style={{ maxWidth:'720px', margin:'40px auto', padding:'0 20px' }}>
        <h1 style={{ color:'#A6E3A1', fontSize:'1.6rem', marginBottom:'24px' }}>Incident Report</h1>
        <div style={{ background:'#12121f', border:'1px solid #2a2a4a', borderRadius:'12px', padding:'28px' }}>
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#ccc',
            margin: 0,
          }}>
            {report}
          </pre>
        </div>
      </div>
    </div>
  );
}

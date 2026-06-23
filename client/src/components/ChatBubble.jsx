import React from 'react';

// Props:
//   role    — 'user' | 'assistant'
//   content — the message string

export default function ChatBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      margin: '8px 0',
    }}>
      {/* Small label above the bubble */}
      <span style={{
        fontSize: '11px', color: '#555',
        marginBottom: '4px',
        paddingLeft: isUser ? 0 : '4px',
        paddingRight: isUser ? '4px' : 0,
      }}>
        {isUser ? 'You' : 'CyberGuide'}
      </span>

      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? '#534AB7' : '#12121f',
        color: isUser ? '#EEEDFE' : '#ccc',
        border: isUser ? 'none' : '1px solid #2a2a4a',
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
      }}>
        {content}
      </div>
    </div>
  );
}

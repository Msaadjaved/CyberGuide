import React from 'react';

// Props:
//   role    — 'user' | 'assistant'
//   content — the message string

export default function ChatBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div style={{
      display:        'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      margin:         '8px 0',
    }}>
      <div style={{
        maxWidth:     '70%',
        padding:      '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background:   isUser ? '#534AB7' : '#F1EFE8',
        color:        isUser ? '#EEEDFE' : '#2C2C2A',
        fontSize:     '14px',
        lineHeight:   '1.6',
        whiteSpace:   'pre-wrap',
      }}>
        {content}
      </div>
    </div>
  );
}

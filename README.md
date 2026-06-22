# CyberGuide — Cybersecurity Incident Response Chatbot

EPITA Paris — Generative AI & Chatbots Project — 2025/2026  
Team: [your team name]

## What it does
CyberGuide walks students and beginners through responding to a cybersecurity
incident step by step — like a coach, not a manual. At the end it generates
a downloadable incident report.

## Tech stack
- Frontend: React + Three.js (3D threat globe on homepage)
- Backend: Node.js + Express
- AI: Groq (primary) + Mistral (benchmarking + GDPR angle)
- Auth: JWT

```

cyberguide/
├── .env.example          ← teammates copy this to .env
├── .gitignore            ← .env and node_modules already blocked
├── README.md             ← setup instructions for the team
├── server/
│   ├── index.js          ← Express entry point
│   ├── package.json
│   ├── routes/
│   │   ├── chat.js       ← POST /api/chat + GET /api/chat/history
│   │   ├── auth.js       ← POST /api/auth/login + /verify
│   │   └── report.js     ← GET /api/report/:sessionId
│   ├── middleware/
│   │   └── auth.js       ← verifyToken() — JWT guard
│   ├── services/
│   │   └── llm.js        ← switches Groq ↔ Mistral via .env
│   └── prompts/
│       └── system.js     ← full CyberGuide system prompt
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── context/AuthContext.jsx
        ├── pages/Home.jsx · Chat.jsx · Report.jsx
        ├── components/ChatBubble.jsx
        └── three/ThreatGlobe.jsx

```


## Setup — read this before you do anything else

### 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/cyberguide.git
cd cyberguide

### 2. Install dependencies
cd server && npm install
cd ../client && npm install

### 3. Set up your environment
cp .env.example .env
# Then open .env and fill in your API keys

### 4. Get your API keys (free, no credit card)
- Groq: https://console.groq.com
- Mistral: https://console.mistral.ai

### 5. Run the app
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev

Frontend runs on http://localhost:5173
Backend runs on http://localhost:3001

## Team
- Member 1 (Makuo): Backend + GenAI integration + benchmarking
- Member 2 (Javed): Frontend + Three.js
- Member 3 (Hassan): Documentation + Privacy + Security

## Professor
GitHub collaborator: lostmart

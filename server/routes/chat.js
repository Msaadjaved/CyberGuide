const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const { getAIReply } = require('../services/llm');

// In-memory session store — fine for a prototype
const sessions = {};

// POST /api/chat
router.post('/', verifyToken, async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'message and sessionId are required' });
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }

  sessions[sessionId].push({ role: 'user', content: message });

  try {
    const reply = await getAIReply(sessions[sessionId]);
    sessions[sessionId].push({ role: 'assistant', content: reply });
    res.json({ reply, sessionId });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: 'AI provider failed. Check your API key and .env file.' });
  }
});

// GET /api/chat/history/:sessionId — used by the Report page
router.get('/history/:sessionId', verifyToken, (req, res) => {
  const history = sessions[req.params.sessionId] || [];
  res.json({ history });
});

module.exports = router;
module.exports.sessions = sessions;

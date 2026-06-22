const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const { sessions } = require('./chat');

// GET /api/report/:sessionId
// Returns the full conversation so the frontend can render the incident report
router.get('/:sessionId', verifyToken, (req, res) => {
  const { sessionId } = req.params;
  const history = sessions[sessionId];

  if (!history || history.length === 0) {
    return res.status(404).json({ error: 'No session found with that ID' });
  }

  // Find the INCIDENT REPORT block in the last assistant message
  const lastAssistant = [...history].reverse().find(m => m.role === 'assistant');
  const reportText = lastAssistant?.content || '';

  res.json({
    sessionId,
    history,
    report: reportText,
  });
});

module.exports = router;

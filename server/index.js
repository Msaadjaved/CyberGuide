require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors    = require('cors');

const chatRoute   = require('./routes/chat');
const authRoute   = require('./routes/auth');
const reportRoute = require('./routes/report');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat',   chatRoute);
app.use('/api/auth',   authRoute);
app.use('/api/report', reportRoute);

// Health check — lets you confirm which AI provider is active
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', provider: process.env.LLM_PROVIDER });
});

app.listen(PORT, () => {
  console.log(`CyberGuide server running on port ${PORT}`);
  console.log(`AI provider: ${process.env.LLM_PROVIDER}`);
});

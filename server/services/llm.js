require('dotenv').config();
const { SYSTEM_PROMPT } = require('../prompts/system');

// ─────────────────────────────────────────────────────────────────
// BENCHMARKING FILE — switch providers by changing .env only
//
//   LLM_PROVIDER=groq        → Groq (llama-3.1-8b-instant)
//   LLM_PROVIDER=openrouter  → Mistral via OpenRouter (free)
//
// No code changes needed — just the env variable + restart server.
// ─────────────────────────────────────────────────────────────────

async function getAIReply(conversationHistory) {
  const provider = process.env.LLM_PROVIDER || 'groq';

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory
  ];

  if (provider === 'groq') {
    return callGroq(messages);
  } else if (provider === 'openrouter') {
    return callOpenRouter(messages);
  } else {
    throw new Error(`Unknown LLM_PROVIDER "${provider}". Use groq or openrouter.`);
  }
}

async function callGroq(messages) {
  const Groq = require('groq-sdk');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const response = await groq.chat.completions.create({
    model: process.env.LLM_MODEL || 'llama-3.1-8b-instant',
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

async function callOpenRouter(messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'CyberGuide',
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || 'mistralai/mistral-7b-instruct:free',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${data.error?.message || JSON.stringify(data)}`);
  }

  return data.choices[0].message.content;
}

module.exports = { getAIReply };
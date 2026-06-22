require('dotenv').config();
const { SYSTEM_PROMPT } = require('../prompts/system');

// ─────────────────────────────────────────────────────────────────
// THIS IS THE KEY FILE FOR THE BENCHMARKING SECTION (4pts)
//
// To switch providers: change LLM_PROVIDER in your .env file
//   LLM_PROVIDER=groq     → uses Groq (llama-3.1-8b-instant)
//   LLM_PROVIDER=mistral  → uses Mistral (mistral-small-latest)
//
// No code changes needed — just the env variable.
// ─────────────────────────────────────────────────────────────────

async function getAIReply(conversationHistory) {
  const provider = process.env.LLM_PROVIDER || 'groq';

  // Always inject the system prompt at the top of every request
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory
  ];

  if (provider === 'groq') {
    return callGroq(messages);
  } else if (provider === 'mistral') {
    return callMistral(messages);
  } else {
    throw new Error(`Unknown LLM_PROVIDER "${provider}". Must be groq or mistral.`);
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

async function callMistral(messages) {
  const { Mistral } = require('@mistralai/mistralai');
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

  const response = await client.chat.complete({
    model: process.env.LLM_MODEL || 'mistral-small-latest',
    messages,
    maxTokens: 1000,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

module.exports = { getAIReply };

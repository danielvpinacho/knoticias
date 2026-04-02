const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is required in env');
}

const endpoint = 'https://api.openrouter.ai/v1/chat/completions';

async function complete(prompt, options = {}) {
  const body = {
    model: options.model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: options.system || 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: options.max_tokens || 512,
    temperature: options.temperature ?? 0.7,
    top_p: options.top_p ?? 0.95
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  return {
    text: text.trim(),
    raw: data,
  };
}

module.exports = { complete };

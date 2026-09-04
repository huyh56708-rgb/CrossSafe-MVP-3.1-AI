export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
  try {
    const { message, context = {} } = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });
    const safeContext = JSON.stringify({
      country: context.country || '', studentStatus: context.status || '',
      jobOffer: String(context.job || '').slice(0, 6000), analysis: String(context.analysis || '').slice(0, 5000)
    });
    const instructions = `You are CrossSafe AI, the safety assistant inside CrossSafe, an educational prototype for international students assessing suspicious job offers. Be concise, practical, calm, and explain your reasoning. Use the supplied CrossSafe analysis as context when present. Do not claim a job is definitely a scam based only on this tool. Do not provide legal advice; suggest checking official government or university sources for legal/visa questions. Never ask for passwords, OTPs, card numbers, or unnecessary personal data. If the user asks something unrelated to job safety, answer briefly and redirect when appropriate. Prefer bullets for risk explanations.\n\nCURRENT CROSSSAFE CONTEXT:\n${safeContext}`;
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5.6-luna', instructions, input: message, store: false })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'OpenAI request failed' });
    return res.status(200).json({ reply: data.output_text || 'No response text was returned.' });
  } catch (error) { return res.status(500).json({ error: 'Server error' }); }
}

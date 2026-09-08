/**
 * CrossSafe AI chat endpoint for Vercel.
 *
 * Required environment variable:
 *   GEMINI_API_KEY
 *
 * Optional:
 *   GEMINI_MODEL (defaults to gemini-2.5-flash)
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export default async function handler(req, res) {
  // Basic CORS / method handling. Same-origin Vercel calls do not require CORS,
  // but these headers make the endpoint predictable.
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed. Use POST /api/chat."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "GEMINI_API_KEY is not configured on Vercel."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: "Message is required."
      });
    }

    // Keep prompts bounded so accidental huge requests do not overwhelm the
    // serverless function.
    const safeMessage = message.slice(0, 8000);

    const systemPrompt = body.systemPrompt ||
      `You are CrossSafe AI, an educational student-safety assistant.
Help students understand suspicious job messages, red flags, country context,
and practical next steps. Do not request or expose passwords, OTPs, payment-card
details, or other sensitive credentials. Be concise, clear, and safety-first.
If a situation may involve fraud or immediate danger, recommend contacting the
relevant official authority or emergency service.`;

    const prompt = `${systemPrompt}\n\nUser message:\n${safeMessage}`;

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(DEFAULT_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 700
        }
      })
    });

    const rawText = await geminiResponse.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = null;
    }

    if (!geminiResponse.ok) {
      const apiMessage =
        data?.error?.message ||
        rawText.slice(0, 500) ||
        `Gemini returned HTTP ${geminiResponse.status}`;

      console.error("Gemini API error:", geminiResponse.status, apiMessage);

      return res.status(502).json({
        ok: false,
        error: `Gemini API error (${geminiResponse.status}): ${apiMessage}`
      });
    }

    const answer = data?.candidates?.[0]?.content?.parts
      ?.map(part => part?.text || "")
      .join("")
      .trim();

    if (!answer) {
      console.error("Unexpected Gemini response:", JSON.stringify(data));
      return res.status(502).json({
        ok: false,
        error: "Gemini returned an empty response."
      });
    }

    return res.status(200).json({
      ok: true,
      response: answer,
      model: DEFAULT_MODEL
    });
  } catch (error) {
    console.error("CrossSafe /api/chat error:", error);

    return res.status(500).json({
      ok: false,
      error: error?.message || "Unexpected server error."
    });
  }
}

# CrossSafe MVP 3.1 — AI

CrossSafe is a front-end prototype for international students assessing suspicious job offers.

## CrossSafe AI
- Global AI chat widget is included on every page.
- Backend endpoint: `/api/chat.js` using the Google Gemini Responses API.
- Default model: `gemini-2.5-flash`.
- The assistant receives the current Check a Job text, country/student context, and visible analysis result when available.

## IMPORTANT — API key security
The Google Gemini API key must NOT be placed in frontend JavaScript or committed into this ZIP/Git repository.

Because an API key was pasted into chat, treat that key as exposed and **revoke/rotate it in Google Gemini Platform before use**. Create a new secret key, then configure it as the `GEMINI_API_KEY` environment variable on your deployment platform.

Example environment variables:

```
GEMINI_API_KEY=your_new_secret_key_here
OPENAI_MODEL=gemini-2.5-flash
```

Do not paste the secret key into `script.js`, HTML, CSS, GitHub, or any publicly downloadable file.

## Deploy on Vercel
1. Import/upload the `crosssafe_work` folder.
2. Add `GEMINI_API_KEY` under Project Settings → Environment Variables.
3. Optionally add `OPENAI_MODEL=gemini-2.5-flash`.
4. Redeploy.

The included `vercel.json` routes `/api/*` to the serverless function.

## Local preview
You can preview the static pages with any local static server. The AI chat requires the `/api/chat` endpoint and a configured environment variable.

## Product logic
Job message → Red Flags → Risk Level → Country Context → Consequence → Recommended Action → CrossSafe AI explanation.

This is an educational prototype. Risk scores and thresholds are illustrative and are not a validated fraud-detection model or legal advice. Never paste passwords, OTPs, card numbers, or unnecessary personal information.

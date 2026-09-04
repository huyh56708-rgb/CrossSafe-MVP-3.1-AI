# CrossSafe MVP 3.0 — Premium Static Prototype

CrossSafe is a front-end prototype for international students who want to assess suspicious job offers and understand money-mule risk.

## What's improved
- Real multi-page navigation: Overview, Check a Job, Country Rules, Risk Engine, Red Flag Library.
- Working job analyzer with explainable scoring and money-mule detection.
- Fixed the previous analyzer regex/escaping bug.
- Country context for Russia, Japan, Korea, Australia and UK.
- Filterable red-flag library.
- Dark mode persisted with localStorage.
- Responsive layout for desktop/tablet/mobile.
- Demo scenario can be opened directly with `check.html?demo=1`.
- No framework, build step or backend required.

## Run
Open `index.html` directly in a browser, or serve the folder with any static server.

## Netlify
Upload the `crosssafe_work` folder to Netlify Drop, or connect the repository. Publish directory is the project root; there is no build command.

## Product logic
The prototype follows the intended CrossSafe flow:
Job message → Red Flags → Risk Level → Country Context → Consequence → Recommended Action.

## Important
This is an educational prototype. Risk scores and thresholds are illustrative and are not a validated fraud-detection model or legal advice. Do not paste passwords, OTPs, card numbers or unnecessary personal information.


## CrossSafe AI (3.1)
- Global AI chat widget is included on every page.
- Backend endpoint: `/api/chat.js` using the OpenAI Responses API.
- Default model: `gpt-5.6-luna`; override with `OPENAI_MODEL`.
- Set `OPENAI_API_KEY` in your hosting provider's environment variables. Never put the API key in frontend JavaScript.
- The assistant receives the current Check a Job text, country/student context, and visible analysis result when available.

### Deploy
Deploy the folder to Vercel (or another host that supports the included serverless function), then add `OPENAI_API_KEY` as an environment variable. The static pages can still be previewed locally, but the AI request requires the deployed `/api/chat` endpoint.

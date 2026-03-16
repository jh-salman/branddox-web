# branddox-web

Modern Next.js website for **Branddox** – Branding Design. Be seen. Be trusted.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Brand colors and typography from the Branddox brand kit

## Run locally

```bash
cd branddox-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app/` – layout, globals.css, homepage
- `src/components/` – Header, Hero, Services, About, CTA, Footer, MegaphoneIcon
- Brand colors in `globals.css` (`--brand-dark`, `--brand-mint`, `--brand-white`, `--brand-green`)

## Fiverr

- **Profile URL:** Set in `src/lib/site-config.ts` as `FIVERR_PROFILE_URL` (used site-wide). Currently: https://www.fiverr.com/s/7Y9XdzL
- **Portfolio data:** Two ways to pull data from your Fiverr profile:
  1. **Automated fetch (recommended):** Install Playwright once (`npx playwright install chromium`), then run `npm run fetch-fiverr`. A browser will open; log in if asked. The script will extract portfolio/gig images and write `src/data/portfolio.json`. Then run `npm run update-portfolio` to merge into `src/data/portfolio.ts`.
  2. **Manual (browser console):** Open https://www.fiverr.com/s/7Y9XdzL while logged in → F12 → Console → paste and run the code from `scripts/extract-fiverr-portfolio-console.js`. Copy the JSON from the clipboard, save as `src/data/portfolio.json`, then run `npm run update-portfolio`.

## Build

```bash
npm run build
npm start
```

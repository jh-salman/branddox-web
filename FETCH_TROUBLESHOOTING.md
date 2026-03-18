# Fetch failed – common causes

When the web app shows **"Failed to fetch"** or similar, check the following.

## 1. Backend not running (local)

- **Local:** Run the API: `cd backend && npm run dev` (default port 4000).
- **Vercel:** Ensure the API project is deployed and the deployment succeeded. Check [Vercel Dashboard](https://vercel.com) → your API project → Deployments.

## 2. Wrong API URL

In **`.env.local`**:

- **Local:** `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` (no trailing slash).
- **Production (Vercel API):** `NEXT_PUBLIC_API_BASE_URL=https://branddox-api.vercel.app`

After changing env, restart the Next.js dev server (`npm run dev`).

## 3. CORS

The backend uses `cors()` with default (all origins). If you still see CORS errors, ensure the request is going to the same origin you expect (check browser Network tab).

## 4. Vercel API env vars

On Vercel, the API project must have:

- `DATABASE_URL`
- `CLOUDINARY_*` (if using upload)
- `AUTH_SECRET`
- etc.

Without these, the API may crash and return 500, which can look like "fetch failed".

## 5. Health check

Open in browser:

- Local: http://localhost:4000/health  
- Production: https://branddox-api.vercel.app/health  

If this fails or doesn’t return `{"ok":true}`, the backend is down or misconfigured.

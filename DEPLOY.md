# Deploy SarvamAI (free cloud)

Do **not** run on your laptop. Use one of these.

## Option A — Cloudflare Pages (best, 2 minutes)

You already use Cloudflare for the Sabarigireesha site.

1. Open [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. **Create** → **Pages** → **Connect to Git**
3. Select repo: `sarvamsabarigireesha/sarvamai`
4. Settings:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root: `/`
5. **Save and Deploy**

Live URL looks like:

`https://sarvamai.pages.dev`

You can later add a custom domain (example: `app.yoursite.com`).

This does **not** touch `sarvam-sabarigireesha`.

## Option B — GitHub Pages (also free)

1. Upload the file `.github/workflows/pages.yml` to this repo (keep the folders).
2. Repo → **Settings** → **Pages**
3. **Source** = **GitHub Actions**
4. **Actions** tab → workflow **Deploy SarvamAI to GitHub Pages** → **Run workflow**

Live URL:

`https://sarvamsabarigireesha.github.io/sarvamai/`

## Option C — Vercel (free)

1. [vercel.com](https://vercel.com) → Sign in with GitHub
2. **Add New Project** → `sarvamai`
3. Framework: Vite (auto)
4. Deploy

URL: `https://sarvamai.vercel.app`

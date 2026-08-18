# SarvamAI

Create once. Publish to Instagram, Facebook and YouTube.

## Run locally

```bash
cd sarvamai
npm install
npm run dev
```

Open the site → **Create account** → use Bulk scheduler, Bulk DM, InFollow.

## Push to GitHub (new repo — do not overwrite the Sabarigireesha website)

Existing site stays here:  
https://github.com/sarvamsabarigireesha/sarvam-sabarigireesha

Create a **new empty** repo named `sarvamai`, then:

```bash
cd sarvamai
git init
git add .
git commit -m "SarvamAI first commit"
git branch -M main
git remote add origin https://github.com/sarvamsabarigireesha/sarvamai.git
git push -u origin main
```

Later updates:

```bash
git add .
git commit -m "Your change"
git push
```

## What’s inside

- Login / signup (each user has their own workspace)
- Bulk scheduler — Instagram + Facebook + YouTube
- Auto DM + Bulk DM (InSenderBot)
- InFollow — follower / following CSV export
- AI Studio, affiliate store, PWA install

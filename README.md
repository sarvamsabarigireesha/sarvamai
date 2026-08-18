# SarvamAI

Create once. Publish to Instagram, Facebook and YouTube.

## Run locally

```bash
npm install
npm run dev
```

Open the site, **Create account**, then use Bulk scheduler, Bulk DM, and InFollow.

## Push this project to GitHub

### 1. GitHub lo empty repo create chey

1. [github.com/new](https://github.com/new) open chey
2. Repository name: `sarvamai` (or whatever you want)
3. **Public** or **Private** choose chey
4. README / .gitignore **add cheyyaku** (repo empty undali)
5. **Create repository**

GitHub neeku ee URL isthundi:

`https://github.com/YOUR_USERNAME/sarvamai.git`

### 2. Laptop / this folder lo git start chey

Terminal lo project folder ki velli:

```bash
cd oneinfo-app

git init
git add .
git commit -m "First commit — Sarvamai app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sarvamai.git
git push -u origin main
```

`YOUR_USERNAME` ni nee GitHub username tho marchu.

### 3. Login adigithe

- Browser lo GitHub login
- or **Personal Access Token** use chey (password kadu)

Token: GitHub → Settings → Developer settings → Personal access tokens → Generate  
Scope: `repo`

Push appud password adigithe token paste chey.

### 4. Tarvata changes update cheyadaniki

Code marchinapudu prati sari:

```bash
cd oneinfo-app
git add .
git commit -m "What you changed"
git push
```

### SSH use cheyali ante (optional)

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/sarvamai.git
git push -u origin main
```

SSH key mundu GitHub lo add undali.

## What’s inside

- Login / signup (each user has their own workspace)
- Bulk scheduler — Instagram + Facebook + YouTube
- Auto DM + Bulk DM (InSenderBot)
- InFollow — follower / following CSV export
- AI Studio, affiliate store, PWA install

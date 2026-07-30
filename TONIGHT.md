# 🚀 CyberVault AI — Live Tonight for $0 (15 minutes)

No domain, no credit card, nothing to buy. Three free accounts, done.

---

## Step 1 — GitHub (3 min)

1. Go to https://github.com → **Sign up** (free)
2. Click the **+** button (top-right) → **New repository**
3. Name: `cybervault-ai` → Public → **Create repository**
4. On the empty repo page, click the blue **"uploading an existing file"** link
5. Unzip `cybervault-ai-store.zip` on your computer
6. Drag ALL the unzipped files/folders into the upload area
7. Click **Commit changes** (green button)

## Step 2 — Free database (2 min)

1. Go to https://neon.tech → **Sign up** (free, use your GitHub account)
2. Click **Create project** → pick any name → **Create**
3. It shows a connection string — click the **copy** button
   (looks like: `postgresql://user:pass@ep-xxxx.aws.neon.tech/neondb?sslmode=require`)
4. **Save this** — you need it in Step 3

## Step 3 — Deploy on Vercel (5 min) → YOUR FREE PERMANENT ADDRESS

1. Go to https://vercel.com/new → **Continue with GitHub** (free Hobby plan)
2. Find your `cybervault-ai` repo → click **Import**
3. **Before clicking Deploy**, expand **Environment Variables** and add:
   - Name: `DATABASE_URL`
   - Value: paste your Neon connection string from Step 2
   - Click **Add**
4. Click **Deploy** → wait ~2 minutes

🎉 **YOUR STORE IS LIVE** at something like:

```
https://cybervault-ai.vercel.app
```

That address is permanent, free forever, has HTTPS, and works worldwide.
Send it to anyone. Put it in your bio. It's yours.

## Step 4 — Stock the store (3 min, one time)

Your store is deployed but the database is empty. Fix it:

**Option A — If you have Node.js on your computer:**
Open a terminal in the unzipped project folder and run:
```bash
npm install
DATABASE_URL="PASTE-YOUR-NEON-STRING" npx drizzle-kit push --force
DATABASE_URL="PASTE-YOUR-NEON-STRING" npx tsx src/db/seed.ts
```

**Option B — No Node.js? Use Neon's SQL Editor:**
1. Go to https://console.neon.tech → your project → **SQL Editor**
2. Ask me and I'll give you the raw SQL to paste — one click, store is stocked.

Refresh your Vercel URL → full store with 8 agents and 33 reviews.

---

## Done! Share your link tonight:

```
https://cybervault-ai.vercel.app
```

Later when you have $11, buy `cybervault-ai.com` and connect it
(instructions in LAUNCH.md). But the .vercel.app address works forever for free.

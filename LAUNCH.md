# 🚀 CyberVault AI Store — Free Launch Guide (Total cost: $0 + ~$11 domain)

Everything in this guide uses free tiers. No credit card required for steps 1–3.
Stripe (step 4) charges nothing upfront — they only take ~2.9% + 30¢ *when you make a sale*.
Your domain `cybervault-ai.com` costs ~$11/year.

---

## Step 1 — Buy your domain (~$11)

1. Go to https://www.namecheap.com (or Cloudflare / Porkbun)
2. Search `cybervault-ai.com` → Add to cart → checkout (~$11/year)
3. You only need the **domain registration** — decline every hosting/email/SSL addon.
   Your hosting is free in Step 4, and Vercel provides SSL automatically.

## Step 2 — Put the code on GitHub (free, 5 min)

1. Create a free account at https://github.com
2. Click **+ → New repository** → name it `cybervault-ai` → Public → **Create**
3. On the empty repo page click **"uploading an existing file"**
4. Drag in **all the files and folders** from this project (everything except
   `node_modules`, `.next`, `.env`, and the `public/downloads` folder)
5. Click **Commit changes**

## Step 3 — Create a free database (Neon, 2 min)

1. Go to https://neon.tech → **Sign up free** → **Create project** (any name, any region)
2. Copy the **connection string** it shows (looks like
   `postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)
3. On your own computer, with Node.js installed, inside this project folder run:

   ```bash
   npm install
   DATABASE_URL="PASTE-YOUR-CONNECTION-STRING" npx drizzle-kit push --force
   DATABASE_URL="PASTE-YOUR-CONNECTION-STRING" npx tsx src/db/seed.ts
   ```

   This creates the tables and stocks the store with the 8 agents + reviews.

## Step 4 — Deploy on Vercel (free, 3 min) → permanent address

1. Go to https://vercel.com/new → **Continue with GitHub** (free Hobby plan)
2. Select your `cybervault-ai` repo → **Import**
3. In **Environment Variables** add:
   - `DATABASE_URL` = your Neon connection string from Step 3
4. Click **Deploy** → wait ~2 minutes → 🎉

Your store now lives **permanently** at an address like:

```
https://cybervault-ai.vercel.app
```

## Step 5 — Connect your domain (5 min)

1. In Vercel: **Project → Settings → Domains** → type `cybervault-ai.com` → Add
2. Vercel shows you a **DNS record** (usually a CNAME pointing to `cname.vercel-dns.com`)
3. In Namecheap: **Domain List → Manage → Advanced DNS** → Add a new record:
   - Type: **CNAME** | Host: **www** | Value: `cname.vercel-dns.com` | TTL: Automatic
   - Type: **A** | Host: **@** | Value: `76.76.21.21` | TTL: Automatic
4. Wait ~10 minutes → **https://www.cybervault-ai.com** is live with free HTTPS 🔒

## Step 6 — Turn on real payments (free until you earn)

1. Register free at https://dashboard.stripe.com/register → complete activation
   (they need your ID + business info — required by law for anyone who takes payments)
2. In Stripe: **Settings → Bank accounts** → add the bank account where payouts go.
   (This is the ONLY place your banking info goes. Never send it to anyone.)
3. In Stripe: **Developers → API keys** → copy the **Secret key** (`sk_live_…`)
4. In Vercel: **Project → Settings → Environment Variables** → add:
   - `STRIPE_SECRET_KEY` = your key
   - (optional, for reliability) `STRIPE_WEBHOOK_SECRET` = signing secret after adding
     webhook endpoint `https://cybervault-ai.com/api/stripe/webhook` in
     Stripe → Developers → Webhooks
5. Vercel → **Deployments → Redeploy**
6. Test it: `https://cybervault-ai.com/api/health` should report `"stripe":"live"`

**First payout** arrives ~7 days after your first real sale, then on an automatic schedule.

---

### Total cost breakdown

| Item | Cost |
|---|---|
| Domain `cybervault-ai.com` | ~$11/year |
| GitHub | $0 |
| Neon database | $0 |
| Vercel hosting + SSL | $0 |
| Stripe | $0 upfront — 2.9% + 30¢ per sale |
| **Total to launch** | **~$11** |

### Troubleshooting

| Problem | Fix |
|---|---|
| Store loads but catalog is empty | Re-run the two DATABASE_URL commands from Step 3 |
| Health says `stripe: not_configured` | Env var typo — must be exactly `STRIPE_SECRET_KEY`, then redeploy |
| Build fails on Vercel | Make sure you uploaded `package.json`, `src/`, and the config files |
| Domain not working after 30 min | Double-check DNS records in Namecheap match exactly what Vercel showed |

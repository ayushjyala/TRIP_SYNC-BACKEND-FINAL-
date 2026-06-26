# Trip Sync — Deployment Guide

## Overview

Trip Sync is a full-stack Node.js app served by Express. The same server delivers
the frontend (static files in `public/`) and the REST API (`/api/*`). There is no
separate frontend deployment step.

---

## 1. Prepare Your MongoDB Atlas Database

1. Go to https://cloud.mongodb.com and create a free account (or log in).
2. Create a **new project** → **Build a Database** → choose **M0 Free tier**.
3. Set a database username and password. Save these — you'll need them.
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere**
   (0.0.0.0/0). This is required for cloud deployments.
5. Once the cluster is ready, click **Connect** → **Drivers** → copy the connection
   string. It will look like:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. Replace `<username>` and `<password>` with your values, and append the database
   name before the `?`:

   ```
   mongodb+srv://bob:mysecret@cluster0.xxxxx.mongodb.net/tripsync?retryWrites=true&w=majority
   ```

---

## 2. Seed the Cloud Database

Run the seed script locally, pointing it at your Atlas URI:

```bash
# Set the URI temporarily in your shell (Linux/macOS)
export MONGODB_URI="mongodb+srv://bob:mysecret@cluster0.xxxxx.mongodb.net/tripsync?retryWrites=true&w=majority"

# Windows PowerShell
$env:MONGODB_URI = "mongodb+srv://bob:mysecret@cluster0.xxxxx.mongodb.net/tripsync?retryWrites=true&w=majority"

# Run seed
npm run seed
```

You should see `✅  Seeded X destinations.` in the terminal.
Verify by opening Atlas → **Browse Collections** → `tripsync` → `destinations`.

---

## 3. Deploy to Render (Recommended — free tier available)

### A. Push your code to GitHub

```bash
git init
git add .
git commit -m "Trip Sync production build"
git remote add origin https://github.com/YOUR_USERNAME/trip-sync.git
git push -u origin main
```

Make sure `.gitignore` includes:
```
node_modules/
.env
```

### B. Create a Web Service on Render

1. Go to https://render.com → **New** → **Web Service**.
2. Connect your GitHub account and select your `trip-sync` repo.
3. Configure:
   | Field | Value |
   |-------|-------|
   | **Environment** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Plan** | Free |

4. Under **Environment Variables**, click **Add Environment Variable** and add:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your Atlas connection string |
   | `NODE_ENV` | `production` |
   | `PORT` | *(leave blank — Render sets this automatically)* |

5. Click **Create Web Service**. Render will build and deploy.
6. After ~2 minutes, your app is live at `https://trip-sync-XXXX.onrender.com`.

> **Note:** Free Render services spin down after 15 minutes of inactivity and take
> ~30 seconds to cold-start. Upgrade to the Starter plan ($7/mo) to avoid this.

---

## 4. Deploy to Railway (Alternative)

1. Go to https://railway.app → **New Project** → **Deploy from GitHub repo**.
2. Select your repo.
3. In **Variables**, add `MONGODB_URI` and `NODE_ENV=production`.
4. Railway auto-detects Node.js and runs `npm start`. Done.

---

## 5. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | Full MongoDB connection string |
| `PORT` | No | Port number (cloud providers set this automatically) |
| `NODE_ENV` | Recommended | Set to `production` on live servers |

---

## 6. Local Development

```bash
# Clone / install
npm install

# Copy environment template
cp .env.example .env
# Then edit .env and set MONGODB_URI to your local or Atlas URI

# Seed the database (first time only)
npm run seed

# Start the dev server with auto-reload
npm run dev

# Or start without nodemon
npm start
```

Open http://localhost:3000

---

## 7. Updating the App

```bash
git add .
git commit -m "your change"
git push
```

Render and Railway both auto-deploy on push to `main`. No further action needed.

---

## 8. Rate Limiting

The API is protected by `express-rate-limit`:
- **100 requests per IP per 15 minutes** on all `/api/*` routes.
- Returns HTTP 429 with a JSON error message if exceeded.
- Adjust the limits in `server.js` → `apiLimiter` if needed.

---

## 9. Health Check (Optional)

Add this route to `server.js` before the SPA fallback if you want Render's health
check to work:

```js
app.get('/health', (req, res) => res.json({ status: 'ok' }));
```

Set the Health Check Path to `/health` in Render's service settings.

---

That's it — your Trip Sync app is production-ready. 🚀

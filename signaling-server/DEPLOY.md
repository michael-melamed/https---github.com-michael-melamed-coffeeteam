# CoffeeTeam Pro - Deploy Signaling Server

## Option 1: Render.com (Recommended) ⭐

### Steps:
1. Go to https://render.com
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo OR upload folder
5. Settings:
   - **Name**: `coffeeteam-signaling`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click "Create Web Service"
7. Wait 2-3 minutes
8. Copy your URL: `https://coffeeteam-signaling.onrender.com`

### Update Client:
Edit `src/services/p2p.ts`:
```typescript
const SIGNALING_SERVER = 'https://coffeeteam-signaling.onrender.com';
```

---

## Option 2: Railway.app

### Steps:
1. Go to https://railway.app
2. Sign up with GitHub (free)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Railway auto-detects Node.js
6. Click "Deploy"
7. Go to Settings → Generate Domain
8. Copy your URL: `https://coffeeteam-signaling.up.railway.app`

### Update Client:
Edit `src/services/p2p.ts`:
```typescript
const SIGNALING_SERVER = 'https://coffeeteam-signaling.up.railway.app';
```

---

## Option 3: Glitch.com (Easiest)

### Steps:
1. Go to https://glitch.com
2. Click "New Project" → "Import from GitHub"
3. Paste repo URL
4. Glitch auto-deploys
5. Your URL: `https://your-project.glitch.me`

---

## Quick Deploy (No GitHub)

### Render.com - Manual Upload:
1. Zip the `signaling-server` folder
2. Go to Render → New Web Service
3. Choose "Deploy from local folder"
4. Upload zip
5. Done!

---

## Environment Variables (if needed)

Add in Render/Railway dashboard:
- `PORT` = (auto-set)
- `NODE_ENV` = `production`

---

## Test Your Deployed Server

```bash
# Health check
curl https://your-server.com/health

# Peers list
curl https://your-server.com/peers
```

---

## Free Tier Limits

**Render.com:**
- ✅ Free forever
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Takes ~30s to wake up

**Railway.app:**
- ✅ $5 free credit/month
- ✅ No sleep
- ⚠️ Limited to 500 hours/month

**Glitch.com:**
- ✅ Free forever
- ⚠️ Sleeps after 5 min
- ⚠️ Limited resources

---

## Recommended: Render.com

**Pros:**
- Completely free
- Easy setup
- Auto-SSL (HTTPS)
- Good for signaling server (low traffic)

**Con:**
- Sleeps after 15 min (but wakes in 30s)

This is PERFECT for a signaling server because:
- You only need it for initial connection
- After P2P is established, server isn't used
- 30s wake-up is acceptable for first connection

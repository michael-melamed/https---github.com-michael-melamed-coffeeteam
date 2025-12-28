# Deploy to Vercel - Quick Guide

## Step 1: Deploy Signaling Server First

Before deploying the app, deploy the signaling server:

1. Go to https://render.com
2. Deploy `signaling-server` folder
3. Get URL: `https://coffeeteam-signaling.onrender.com`

## Step 2: Configure Environment Variable in Vercel

1. Go to https://vercel.com/micm260m-3861s-projects/ct-pro
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name**: `VITE_SIGNALING_SERVER`
   - **Value**: `https://coffeeteam-signaling.onrender.com`
   - **Environment**: Production, Preview, Development (all)
4. Save

## Step 3: Deploy to Vercel

### Option A: Git Push (Automatic)
```bash
git add .
git commit -m "React rewrite with P2P"
git push
```
Vercel will auto-deploy!

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Option C: Vercel Dashboard
1. Go to https://vercel.com/micm260m-3861s-projects/ct-pro
2. Click "Deployments" → "Redeploy"
3. Done!

## Step 4: Test

1. Open your Vercel URL
2. Create cashier + barista in 2 windows
3. Test P2P order flow

## Important Files

**Keep:**
- `src/` - All React code
- `public/` - Static assets
- `index.html` - Entry point
- `package.json` - Dependencies
- `vite.config.ts` - Build config
- `vercel.json` - Vercel config

**Remove (old files):**
- `src/ui/` - Old vanilla JS
- `src/core/` - Old state machine
- Old service files

## Troubleshooting

**Build fails?**
- Check `package.json` has all dependencies
- Run `npm install` locally first
- Check build logs in Vercel

**P2P not working?**
- Verify `VITE_SIGNALING_SERVER` is set
- Check signaling server is running
- Open browser console for errors

**App not loading?**
- Check `vercel.json` rewrites
- Verify `dist` folder is generated
- Check Vercel build logs

## Success!

Your app is now live at:
`https://ct-pro.vercel.app`

Test with 2 devices/browsers!

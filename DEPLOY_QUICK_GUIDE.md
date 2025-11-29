# 🚀 Quick Deploy Guide to Render

## Prerequisites
- GitHub account
- Render account (free) - https://render.com

## 5-Minute Deployment Steps

### 1️⃣ Push to GitHub
```bash
cd bullshit-game
git init
git add .
git commit -m "Bullshit card game ready for deployment"
```

Create repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy on Render
1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in:
   - **Name:** `bullshit-card-game`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
5. Click **"Create Web Service"**

### 3️⃣ Wait & Play!
- Deployment takes ~2-5 minutes
- You'll get a URL like: `https://bullshit-card-game-xxxx.onrender.com`
- Share with family and play! 🎮

## ⚠️ Important: Free Tier Notes
- Server sleeps after 15 min of inactivity
- First load takes 30-60 seconds to wake up
- 750 hours/month free runtime

## 🎮 How to Play Online
1. **Host:** Opens the URL → Creates room → Shares 6-letter code
2. **Players:** Opens same URL → Joins with code
3. **Host:** Starts game when everyone joins
4. **Play:** Follow the rules and have fun!

## 🔧 If Something Breaks
- Check Render logs in dashboard
- Redeploy: Push changes to GitHub, Render auto-updates
- Local test: `npm install && npm start` → http://localhost:3000

---
**That's it! You're now hosting a multiplayer card game for free! 🎉**

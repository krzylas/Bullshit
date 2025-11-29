# 🎴 Bullshit Card Game - Online Multiplayer

Real-time multiplayer bluffing card game. Play with family and friends online!

## 🎯 Quick Start

### Local Testing
```bash
cd bullshit-game
npm install
npm start
# Open http://localhost:3000
```

### Deploy to Render (FREE)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Bullshit card game"
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com
   - New + → Web Service
   - Connect your GitHub repo
   - Settings:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Plan: **Free**
   - Click "Create Web Service"

3. **Share & Play:**
   - Get your URL: `https://your-app.onrender.com`
   - One person creates room
   - Others join with 6-letter code
   - Host starts game!

## 🎮 Game Rules

### Objective
First player to get rid of all cards wins!

### Basic Play
- **2♣️ starts** - Player with 2 of clubs goes first
- **Play 1, 3, 4, 5, or 6 cards** per turn (not 2!)
- **Claim same or higher value** than previous player
- **Jokers are wildcards** - count as any value (can never be caught lying!)

### Checking (Calling Bullshit!)
**Any player can check the previous player:**

- **If caught lying:**
  - Liar gets checked cards + 3 from deck
  - Liar loses their turn

- **If telling truth:**
  - Checker gets checked cards + 3 from deck
  - Checker loses their turn

### Features
- ✅ Real-time multiplayer (2-6 players)
- ✅ Visual card reveal popup when checking
- ✅ Circular poker table design
- ✅ Joker wildcard support
- ✅ Mobile responsive
- ✅ Works on any device

## 📁 Project Structure
```
bullshit-game/
├── server.js           # Node.js server with Socket.io
├── package.json        # Dependencies
├── public/
│   └── index.html     # Game client
├── GAME_RULES.md      # Detailed rules
└── README.md          # This file
```

## 🔧 Technologies
- **Backend:** Node.js, Express, Socket.io
- **Frontend:** HTML/CSS/JavaScript
- **Hosting:** Render (free tier)

## ⚠️ Render Free Tier Notes
- Server sleeps after 15 min inactivity
- First load takes 30-60 seconds to wake
- 750 hours/month free (perfect for family games)

## 🐛 Troubleshooting

**Server not connecting?**
- Wait 60 seconds for Render wake-up
- Check Render dashboard for errors

**Room not found?**
- Check room code is correct (case-sensitive)
- Game may have ended

**Modal blocking screen?**
- Press ESC or click outside modal
- Hard refresh: Ctrl+F5

## 📝 Development

**Testing locally:**
1. `npm install`
2. `npm start`
3. Open multiple browser tabs
4. Test with localhost:3000

**Before deploying:**
- Test full game flow
- Verify check feature works
- Test modal can close
- Play complete game

---

**Made for family game nights! 🎉**

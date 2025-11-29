# Bullshit Card Game - Online Multiplayer 🃏

A real-time multiplayer card game where players can bluff and challenge each other online!

## Game Rules

- **2♣️ starts**: Player with 2 of clubs goes first
- **Progressive values**: Cards played must be same or higher value than previous claim
- **Check anytime**: Any player can check the previous player after they play
- **Penalties**:
  - If caught lying: Liar gets their cards back + 3 cards from deck
  - If falsely accused: Checker gets the checked cards + 3 cards from deck
- **Valid plays**: You can only play 1, 3, 4, 5, or 6 cards per turn
- **Jokers**: Wild cards that can represent any value you choose

## Local Development

1. **Install dependencies:**
   ```bash
   cd bullshit-game
   npm install
   ```

2. **Run the server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## Deploy to Render (FREE)

### Step 1: Prepare Your Code

1. Make sure all files are in the `bullshit-game` folder
2. Initialize git repository (if not already):
   ```bash
   cd bullshit-game
   git init
   git add .
   git commit -m "Initial commit"
   ```

### Step 2: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bullshit-card-game.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Render

1. **Go to Render:** https://render.com
2. **Sign up/Login** (use GitHub login for easy access)
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository** (bullshit-card-game)
5. **Configure the service:**
   - **Name:** `bullshit-card-game` (or any name you want)
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave empty OR set to `bullshit-game` if it's in a subdirectory
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Select **"Free"**

6. **Click "Create Web Service"**

7. **Wait for deployment** (usually takes 2-5 minutes)

8. **Get your URL:** Render will provide a URL like `https://your-app-name.onrender.com`

### Step 4: Share and Play!

- Share the Render URL with your family/friends
- One person creates a room and shares the 6-letter code
- Others join using the room code
- Host starts the game when everyone is ready

## Important Notes for Render Free Tier

⚠️ **Free tier limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- 750 hours/month of runtime (enough for casual use)

💡 **Tips:**
- Keep the tab open during games to prevent disconnection
- If someone gets disconnected, they'll need to rejoin the room
- For better reliability, consider upgrading to paid tier ($7/month)

## Troubleshooting

### "Cannot connect to server"
- Wait 30-60 seconds on first load (server is waking up)
- Check if the Render service is running in your dashboard

### "Room not found"
- Make sure room code is typed correctly (case-sensitive)
- Room may have expired if game ended

### Players getting disconnected
- Check internet connection
- Render free tier may spin down - first player to reconnect wakes it up

## Local Testing

Test locally before deploying:
```bash
npm install
npm start
# Open http://localhost:3000 in multiple browser tabs/windows
```

## Project Structure

```
bullshit-game/
├── server.js          # Node.js + Socket.io server
├── package.json       # Dependencies
├── public/
│   └── index.html    # Game client (HTML/CSS/JS)
└── README.md         # This file
```

## Technologies Used

- **Backend:** Node.js, Express, Socket.io
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Deployment:** Render

## Support

If you encounter issues:
1. Check Render dashboard logs
2. Ensure all files are committed to GitHub
3. Verify build and start commands in Render settings

---

**Enjoy playing with your family! 🎮**

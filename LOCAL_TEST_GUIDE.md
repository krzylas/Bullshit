# 🧪 Local Testing Guide - Before Deployment

## ✅ Server is Running!

Your game is now running locally at: **http://localhost:3000**

Click the browser preview button above to test it!

---

## 🎯 Testing Checklist

### 1. **Lobby Screen Test** ✅
- [ ] Page loads without any popups
- [ ] No "Cards Revealed" modal appears
- [ ] You can see "Welcome!" screen
- [ ] Input field for name is visible
- [ ] "Create Room" and "Join Room" buttons work

### 2. **Create Room Test** ✅
- [ ] Enter a name
- [ ] Click "Create Room"
- [ ] Room code appears (6 letters)
- [ ] Still no modal blocking the screen
- [ ] "Start Game" button is visible for host

### 3. **Multi-Player Test** ✅
Open in second browser tab/window (Ctrl+Shift+N for new window):
- [ ] Second player can join with room code
- [ ] Both players appear in waiting room
- [ ] No modal appears during waiting

### 4. **Game Start Test** ✅
- [ ] Host clicks "Start Game"
- [ ] Game screen appears
- [ ] Cards are dealt to players
- [ ] Circular poker table shows in middle
- [ ] NO MODAL appears on game start
- [ ] Current player indicator shows

### 5. **Playing Cards Test** ✅
- [ ] Select 1, 3, 4, 5, or 6 cards
- [ ] Claim selector appears
- [ ] Choose a value
- [ ] Click "Play Selected Cards"
- [ ] Cards go to pile
- [ ] Turn moves to next player
- [ ] NO MODAL appears after playing

### 6. **Check Feature Test** 🎯 (CRITICAL)
This is where the modal should ONLY appear:

- [ ] Player 1 plays cards
- [ ] Player 2's turn starts
- [ ] "Check Previous Player" button is enabled
- [ ] Click "Check Previous Player"
- [ ] **NOW modal should appear** with:
  - Revealed cards displayed
  - Red/Green title based on result
  - Penalty info shown
  - "Continue Game" button visible
- [ ] Click "Continue Game" button
- [ ] Modal closes successfully
- [ ] Game continues normally
- [ ] Modal does NOT reappear

### 7. **Alternative Close Methods** ✅
After another check:
- [ ] Press ESC key - modal closes
- [ ] Click outside modal (dark area) - modal closes

### 8. **Joker Test** 🃏
- [ ] Play a joker card
- [ ] Joker shows "WILD" label in hand
- [ ] When revealed, shows as wildcard
- [ ] Cannot be caught lying with joker

### 9. **Full Game Test** 🎮
- [ ] Play several rounds
- [ ] Check various players
- [ ] Modal only appears when checking
- [ ] Modal can always be closed
- [ ] Game continues to completion
- [ ] Winner is announced

---

## 🐛 If You See Issues:

### Modal Appears on Lobby Screen:
- This is the bug we just fixed
- Hard refresh: Ctrl+F5
- If still appearing, check browser console (F12)

### "Continue Game" Button Doesn't Work:
- Check browser console (F12) for errors
- Try ESC key or click outside modal
- Should see "Closing reveal modal" in console

### Modal Keeps Reappearing:
- We added checkId tracking to prevent this
- Should only show once per check action
- Console should show "Prevented modal from showing on wrong screen"

---

## ✅ Success Criteria

**Before deploying, confirm:**

1. ✅ NO modal on lobby screen
2. ✅ NO modal on room waiting screen
3. ✅ NO modal on game start
4. ✅ NO modal after playing cards
5. ✅ Modal ONLY appears when someone checks
6. ✅ Modal can ALWAYS be closed (3 ways)
7. ✅ Game continues normally after closing modal
8. ✅ Full game can be played to completion

---

## 🚀 After Testing Successfully:

If all tests pass, deploy with:

```bash
# Stop the local server first
# Press Ctrl+C in the terminal running npm start

# Then deploy
git push origin main
```

Render will auto-deploy in 2-3 minutes!

---

## 🔍 Browser Console

Open developer tools (F12) and check console for:
- ✅ "Modal initialized as hidden" on page load
- ✅ "Closing reveal modal" when closing modal
- ✅ "Prevented modal from showing on wrong screen" if triggered incorrectly

No errors should appear!

---

## 📞 If Tests Fail:

1. Check browser console for errors
2. Make sure you hard refreshed (Ctrl+F5)
3. Try in different browser
4. Check that server is running without errors
5. Report specific failing test from list above

**DO NOT deploy if any tests fail!**

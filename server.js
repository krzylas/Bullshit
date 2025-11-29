const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Game rooms storage
const rooms = new Map();

// Card deck creation
function createDeck() {
    const suits = ['♠️', '♥️', '♣️', '♦️'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const valueMap = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
    
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({
                suit: suit,
                value: value,
                numValue: valueMap[value],
                isRed: suit === '♥️' || suit === '♦️'
            });
        }
    }
    
    // Add 2 jokers
    deck.push({ suit: '🃏', value: 'JOKER', numValue: 0, isRed: false, isJoker: true });
    deck.push({ suit: '🃏', value: 'JOKER', numValue: 0, isRed: false, isJoker: true });
    
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Create or join room
    socket.on('createRoom', (data) => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const room = {
            code: roomCode,
            players: [{
                id: socket.id,
                name: data.playerName,
                hand: [],
                isHost: true
            }],
            gameStarted: false,
            deck: [],
            pile: [],
            currentPlayerIndex: 0,
            lastClaimedValue: null,
            lastPlayedCards: []
        };
        
        rooms.set(roomCode, room);
        socket.join(roomCode);
        socket.emit('roomCreated', { roomCode, players: room.players });
        console.log(`Room ${roomCode} created by ${data.playerName}`);
    });
    
    socket.on('joinRoom', (data) => {
        const room = rooms.get(data.roomCode);
        
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }
        
        if (room.gameStarted) {
            socket.emit('error', { message: 'Game already in progress' });
            return;
        }
        
        if (room.players.length >= 6) {
            socket.emit('error', { message: 'Room is full' });
            return;
        }
        
        room.players.push({
            id: socket.id,
            name: data.playerName,
            hand: [],
            isHost: false
        });
        
        socket.join(data.roomCode);
        io.to(data.roomCode).emit('playerJoined', { players: room.players });
        console.log(`${data.playerName} joined room ${data.roomCode}`);
    });
    
    socket.on('startGame', (data) => {
        const room = rooms.get(data.roomCode);
        
        if (!room) return;
        
        const host = room.players.find(p => p.id === socket.id && p.isHost);
        if (!host) {
            socket.emit('error', { message: 'Only host can start the game' });
            return;
        }
        
        if (room.players.length < 2) {
            socket.emit('error', { message: 'Need at least 2 players' });
            return;
        }
        
        // Create and shuffle deck
        room.deck = createDeck();
        room.pile = [];
        room.lastClaimedValue = null;
        room.lastPlayedCards = [];
        
        // Deal cards
        const cardsPerPlayer = Math.floor(room.deck.length / room.players.length);
        room.players.forEach(player => {
            player.hand = room.deck.splice(0, cardsPerPlayer);
        });
        
        // Find who has 2 of clubs
        for (let i = 0; i < room.players.length; i++) {
            const hasTwoClubs = room.players[i].hand.some(card => 
                card.value === '2' && card.suit === '♣️'
            );
            if (hasTwoClubs) {
                room.currentPlayerIndex = i;
                break;
            }
        }
        
        room.gameStarted = true;
        
        // Send game state to all players - NO reveal data
        room.players.forEach(player => {
            io.to(player.id).emit('gameStarted', {
                players: room.players.map(p => ({ id: p.id, name: p.name, cardCount: p.hand.length })),
                yourHand: player.hand,
                currentPlayerIndex: room.currentPlayerIndex,
                deckCount: room.deck.length,
                pileCount: room.pile.length,
                currentMin: room.lastClaimedValue || 2,
                canCheck: false,
                revealedCards: null, // Explicitly null
                checkId: null // Explicitly null
            });
        });
        
        console.log(`Game started in room ${data.roomCode}`);
    });
    
    socket.on('playCards', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room || !room.gameStarted) return;
        
        const player = room.players[room.currentPlayerIndex];
        if (player.id !== socket.id) {
            socket.emit('error', { message: 'Not your turn' });
            return;
        }
        
        // Validate card count
        if (![1, 3, 4, 5, 6].includes(data.cards.length)) {
            socket.emit('error', { message: 'Invalid number of cards' });
            return;
        }
        
        // Validate claimed value
        const minValue = room.lastClaimedValue || 2;
        if (data.claimedValue < minValue) {
            socket.emit('error', { message: 'Value too low' });
            return;
        }
        
        // Store actual cards being played before removing from hand
        const cardsBeingPlayed = [];
        const sortedIndices = data.cards.sort((a, b) => b - a); // Sort descending to remove from end first
        
        sortedIndices.forEach(cardIndex => {
            const card = player.hand.splice(cardIndex, 1)[0];
            if (card) {
                // If playing a joker, store the selected value
                if (data.jokerValues && card.isJoker) {
                    card.selectedValue = data.jokerValues[cardIndex] || data.claimedValue;
                }
                cardsBeingPlayed.push(card);
                room.pile.push(card);
            }
        });
        
        room.lastPlayedCards = cardsBeingPlayed;
        room.lastClaimedValue = data.claimedValue;
        
        // Next player
        room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
        
        // Check for winner
        const winner = room.players.find(p => p.hand.length === 0);
        
        // Broadcast game state - NO reveal data for normal play
        room.players.forEach(p => {
            io.to(p.id).emit('gameUpdate', {
                players: room.players.map(pl => ({ id: pl.id, name: pl.name, cardCount: pl.hand.length })),
                yourHand: p.hand,
                currentPlayerIndex: room.currentPlayerIndex,
                deckCount: room.deck.length,
                pileCount: room.pile.length,
                currentMin: room.lastClaimedValue,
                canCheck: room.lastPlayedCards.length > 0 && !winner,
                lastPlay: {
                    playerName: player.name,
                    cardCount: data.cards.length,
                    claimedValue: data.claimedValue
                },
                winner: winner ? winner.name : null,
                revealedCards: null, // Explicitly null - no reveal on normal play
                checkId: null // Explicitly null
            });
        });
    });
    
    socket.on('checkPlayer', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room || !room.gameStarted) return;
        
        if (room.lastPlayedCards.length === 0) return;
        
        const checker = room.players.find(p => p.id === socket.id);
        if (!checker) return;
        
        const previousPlayerIndex = (room.currentPlayerIndex - 1 + room.players.length) % room.players.length;
        const checked = room.players[previousPlayerIndex];
        
        // Check if lying - jokers count as the claimed value automatically
        let isLying = false;
        for (let card of room.lastPlayedCards) {
            let cardValue;
            if (card.isJoker) {
                // Jokers are wildcards - they count as whatever was claimed
                cardValue = room.lastClaimedValue;
            } else {
                cardValue = card.numValue;
            }
            
            if (cardValue !== room.lastClaimedValue) {
                isLying = true;
                break;
            }
        }
        
        let message = '';
        const revealedCards = [...room.lastPlayedCards];
        const additionalCards = [];
        
        if (isLying) {
            // Liar caught! They get checked cards + 3 more
            message = `🚨 ${checked.name} was LYING!`;
            checked.hand.push(...room.lastPlayedCards);
            
            // Give 3 additional cards from deck
            for (let i = 0; i < 3 && room.deck.length > 0; i++) {
                const card = room.deck.pop();
                checked.hand.push(card);
                additionalCards.push(card);
            }
            
            // Remove checked cards from pile
            room.pile = room.pile.filter(card => !room.lastPlayedCards.includes(card));
            
            // Liar loses their turn - set current player back to them
            room.currentPlayerIndex = previousPlayerIndex;
        } else {
            // Truth teller! Checker gets checked cards + 3 more and loses their turn
            message = `✅ ${checked.name} was TELLING THE TRUTH!`;
            checker.hand.push(...room.lastPlayedCards);
            
            // Give 3 additional cards from deck
            for (let i = 0; i < 3 && room.deck.length > 0; i++) {
                const card = room.deck.pop();
                checker.hand.push(card);
                additionalCards.push(card);
            }
            
            // Remove checked cards from pile
            room.pile = room.pile.filter(card => !room.lastPlayedCards.includes(card));
            
            // Checker loses their turn - keep current player as the one who was checked
            room.currentPlayerIndex = previousPlayerIndex;
        }
        
        const cardsToReveal = room.lastPlayedCards;
        room.lastPlayedCards = [];
        
        // Create unique check ID to prevent duplicate modals
        const checkId = Date.now() + Math.random();
        
        // Broadcast updated state with revealed cards
        room.players.forEach(p => {
            io.to(p.id).emit('gameUpdate', {
                players: room.players.map(pl => ({ id: pl.id, name: pl.name, cardCount: pl.hand.length })),
                yourHand: p.hand,
                currentPlayerIndex: room.currentPlayerIndex,
                deckCount: room.deck.length,
                pileCount: room.pile.length,
                currentMin: room.lastClaimedValue,
                canCheck: false,
                message: message,
                revealedCards: cardsToReveal,
                additionalCardCount: additionalCards.length,
                wasLying: isLying,
                checkedPlayer: checked.name,
                checkerPlayer: checker.name,
                checkId: checkId
            });
        });
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        // Remove player from rooms
        rooms.forEach((room, code) => {
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                const player = room.players[playerIndex];
                room.players.splice(playerIndex, 1);
                
                if (room.players.length === 0) {
                    rooms.delete(code);
                } else {
                    io.to(code).emit('playerLeft', { 
                        playerName: player.name,
                        players: room.players 
                    });
                }
            }
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

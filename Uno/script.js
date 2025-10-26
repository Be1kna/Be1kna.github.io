// UNO Game Logic
class UnoGame {
    constructor() {
        this.players = [
            { name: 'Player 1', hand: [], isHuman: true },
            { name: 'Player 2', hand: [], isHuman: false }
        ];
        this.currentPlayer = 0;
        this.direction = 1; // 1 for clockwise, -1 for counterclockwise
        this.deck = [];
        this.discardPile = [];
        this.gameState = 'waiting'; // waiting, playing, gameOver
        this.unoCalled = false;
        this.pendingDraw = 0;
        this.currentColor = null;
        this.canStack = false; // Track if player can continue stacking cards
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.startGame();
    }

    createDeck() {
        const colors = ['Red', 'Blue', 'Green', 'Yellow'];
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const specialCards = ['Skip', 'Reverse', 'Draw_2'];
        
        this.deck = [];
        
        // Create numbered cards (0-9) for each color
        colors.forEach(color => {
            // One 0 card per color
            this.deck.push({ color, value: 0, type: 'number', image: `${color}_0.jpg` });
            
            // Two cards for numbers 1-9 per color
            numbers.slice(1).forEach(num => {
                this.deck.push({ color, value: num, type: 'number', image: `${color}_${num}.jpg` });
                this.deck.push({ color, value: num, type: 'number', image: `${color}_${num}.jpg` });
            });
            
            // Two special cards per color
            specialCards.forEach(special => {
                this.deck.push({ color, value: special, type: 'special', image: `${color}_${special}.jpg` });
                this.deck.push({ color, value: special, type: 'special', image: `${color}_${special}.jpg` });
            });
        });
        
        // Add Wild cards (4 regular Wild, 4 Wild Draw 4)
        for (let i = 0; i < 4; i++) {
            this.deck.push({ color: 'Wild', value: 'Wild', type: 'wild', image: 'Wild.jpg' });
            this.deck.push({ color: 'Wild', value: 'Draw_4', type: 'wild', image: 'Wild_Draw_4.jpg' });
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        // Deal 7 cards to each player
        for (let i = 0; i < 7; i++) {
            this.players.forEach(player => {
                player.hand.push(this.deck.pop());
            });
        }
        
        // Place first card on discard pile - must be a number card (not action card)
        let firstCard = this.deck.pop();
        while (firstCard.type === 'wild' || firstCard.type === 'special') {
            this.deck.unshift(firstCard);
            firstCard = this.deck.pop();
        }
        this.discardPile.push(firstCard);
        this.currentColor = firstCard.color;
    }

    startGame() {
        this.gameState = 'playing';
        this.updateDisplay();
        this.updatePlayableCards();
    }

    setupEventListeners() {
        // Draw card button
        document.getElementById('draw-card-btn').addEventListener('click', () => {
            this.drawCard();
        });

        // Draw pending cards button
        document.getElementById('draw-pending-btn').addEventListener('click', () => {
            this.drawPendingCards();
        });

        // UNO button
        document.getElementById('uno-btn').addEventListener('click', () => {
            this.callUno();
        });

        // New game button
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });

        // End turn button
        document.getElementById('end-turn-btn').addEventListener('click', () => {
            this.endTurn();
        });

        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.newGame();
        });

        // Color selection buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectColor(e.target.dataset.color);
            });
        });

        // Card click events will be set up dynamically
    }

    updateDisplay() {
        // Update current player
        document.getElementById('current-player-name').textContent = this.players[this.currentPlayer].name;
        
        // Update card counts
        document.getElementById('player1-count').textContent = this.players[0].hand.length;
        document.getElementById('player2-count').textContent = this.players[1].hand.length;
        
        // Update deck count
        document.getElementById('cards-left').textContent = this.deck.length;
        
        // Update game status
        const gameStatusElement = document.getElementById('game-status');
        if (this.pendingDraw > 0) {
            gameStatusElement.textContent = `Draw ${this.pendingDraw} cards or play Draw 2/Draw 4!`;
            gameStatusElement.classList.add('pending-draw');
        } else {
            gameStatusElement.classList.remove('pending-draw');
            if (this.unoCalled) {
                gameStatusElement.textContent = 'UNO called!';
            } else {
                gameStatusElement.textContent = 'Game in progress';
            }
        }
        
        // Update top card
        this.updateTopCard();
        
        // Update player hands
        this.updatePlayerHands();
        
        // Update active player styling
        document.querySelectorAll('.player-area').forEach((area, index) => {
            area.classList.toggle('active', index === this.currentPlayer);
        });
    }

    updateTopCard() {
        const topCardElement = document.getElementById('top-card');
        const topCard = this.discardPile[this.discardPile.length - 1];
        
        if (topCard) {
            topCardElement.style.backgroundImage = `url('archive/${topCard.image}')`;
            topCardElement.style.display = 'block';
        }
        
        // Update current color indicator
        this.updateColorIndicator();
    }
    
    updateColorIndicator() {
        const colorCircle = document.getElementById('color-circle');
        if (colorCircle && this.currentColor) {
            colorCircle.className = `color-circle ${this.currentColor.toLowerCase()}`;
        }
    }

    updatePlayerHands() {
        // Update Player 1 hand (human player)
        const player1Hand = document.getElementById('player1-hand');
        player1Hand.innerHTML = '';
        
        this.players[0].hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, 0, index);
            player1Hand.appendChild(cardElement);
        });

        // Update Player 2 hand (AI player) - show card backs
        const player2Hand = document.getElementById('player2-hand');
        player2Hand.innerHTML = '';
        
        this.players[1].hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, 1, index);
            player2Hand.appendChild(cardElement);
        });
    }

    createCardElement(card, playerIndex, cardIndex) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.player = playerIndex;
        cardDiv.dataset.cardIndex = cardIndex;
        
        if (playerIndex === 0) {
            // Human player - show actual cards
            cardDiv.style.backgroundImage = `url('archive/${card.image}')`;
            cardDiv.addEventListener('click', () => {
                this.playCard(playerIndex, cardIndex);
            });
        } else {
            // AI player - show card backs
            cardDiv.className = 'card-back';
            cardDiv.innerHTML = '<span>?</span>';
        }
        
        return cardDiv;
    }

    updatePlayableCards() {
        const topCard = this.discardPile[this.discardPile.length - 1];
        const currentPlayerHand = this.players[this.currentPlayer].hand;
        
        // Remove previous playable styling
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('playable');
        });
        
        // Add playable styling to valid cards
        currentPlayerHand.forEach((card, index) => {
            if (this.canPlayCard(card, topCard)) {
                const cardElement = document.querySelector(`[data-player="${this.currentPlayer}"][data-card-index="${index}"]`);
                if (cardElement) {
                    cardElement.classList.add('playable');
                }
            }
        });
    }

    canPlayCard(card, topCard) {
        // If there are pending draws, only Draw 2 or Wild Draw 4 can be played
        if (this.pendingDraw > 0) {
            return card.value === 'Draw_2' || card.value === 'Draw_4';
        }
        
        // Wild cards can always be played
        if (card.type === 'wild') {
            return true;
        }
        
        // Check color match (this is the most important - works after Wild cards)
        if (card.color === this.currentColor) {
            return true;
        }
        
        // Check value match (same number) - only if top card is not Wild
        if (topCard.type !== 'wild' && card.value === topCard.value) {
            return true;
        }
        
        // NO type matching for action cards - Skip/Reverse/Draw 2 only match by color
        // This means you can't play Skip on Skip unless they're the same color
        
        return false;
    }

    playCard(playerIndex, cardIndex) {
        if (playerIndex !== this.currentPlayer || this.gameState !== 'playing') {
            return;
        }
        
        const card = this.players[playerIndex].hand[cardIndex];
        const topCard = this.discardPile[this.discardPile.length - 1];
        
        if (!this.canPlayCard(card, topCard)) {
            return;
        }
        
        // Remove card from hand
        this.players[playerIndex].hand.splice(cardIndex, 1);
        
        // Add to discard pile
        this.discardPile.push(card);
        
        // Handle special card effects
        this.handleCardEffect(card, playerIndex);
        
        // Check for UNO
        if (this.players[playerIndex].hand.length === 1) {
            this.unoCalled = false;
            if (playerIndex === 0) {
                document.getElementById('uno-btn').disabled = false;
            }
        } else if (this.players[playerIndex].hand.length === 0) {
            this.endGame(playerIndex);
            return;
        }
        
        // Check if player can continue stacking (same number/action)
        this.checkCanStack(card, playerIndex);
        
        // Update display
        this.updateDisplay();
        this.updatePlayableCards();
        
        // AI turn (only if it's still the AI's turn after card effects)
        if (this.currentPlayer === 1 && this.gameState === 'playing') {
            setTimeout(() => {
                this.aiPlay();
            }, 1000);
        }
    }

    checkCanStack(card, playerIndex) {
        // Check if player can continue stacking cards
        const topCard = this.discardPile[this.discardPile.length - 1];
        const playerHand = this.players[playerIndex].hand;
        
        // Special logic for Draw 2/Draw 4 stacking
        if (this.pendingDraw > 0) {
            // When stacking Draw cards, only allow same action cards (Draw 2 or Draw 4)
            const canStackMore = playerHand.some(handCard => 
                (handCard.value === 'Draw_2' || handCard.value === 'Draw_4') && handCard !== card
            );
            
            this.canStack = canStackMore && playerIndex === 0;
            
            // Enable/disable End Turn button
            const endTurnBtn = document.getElementById('end-turn-btn');
            if (playerIndex === 0) {
                endTurnBtn.disabled = false;
            } else {
                endTurnBtn.disabled = true;
            }
            
            // If player can't stack more or it's AI, end turn automatically
            if (!canStackMore || playerIndex === 1) {
                this.endTurn();
            }
            return;
        }
        
        // Regular stacking logic for non-Draw cards
        const canStackMore = playerHand.some(handCard => {
            // Only same value/action (any color) - NO color matching for stacking
            const sameValue = handCard.value === topCard.value;
            // Wild cards can always be played
            const isWild = handCard.type === 'wild';
            
            return (sameValue || isWild) && handCard !== card;
        });
        
        this.canStack = canStackMore && playerIndex === 0; // Only human player can stack
        
        // Enable/disable End Turn button
        const endTurnBtn = document.getElementById('end-turn-btn');
        if (playerIndex === 0) {
            endTurnBtn.disabled = false;
        } else {
            endTurnBtn.disabled = true;
        }
        
        // If player can't stack more or it's AI, end turn automatically
        if (!canStackMore || playerIndex === 1) {
            this.endTurn();
        }
    }
    
    endTurn() {
        // Reset stacking state
        this.canStack = false;
        document.getElementById('end-turn-btn').disabled = true;
        
        // For regular cards (not Skip/Reverse), move to next player
        const topCard = this.discardPile[this.discardPile.length - 1];
        if (topCard.value !== 'Skip' && topCard.value !== 'Reverse') {
            this.nextTurn();
        }
        
        // Update display
        this.updateDisplay();
        this.updatePlayableCards();
        
        // AI turn
        if (this.currentPlayer === 1 && this.gameState === 'playing') {
            setTimeout(() => {
                this.aiPlay();
            }, 1000);
        }
    }

    handleCardEffect(card, playerIndex) {
        switch (card.value) {
            case 'Skip':
                // Skip means current player plays again (in 2-player game)
                // No turn change needed
                break;
            case 'Reverse':
                // In 2-player game, reverse acts like skip
                // No turn change needed
                break;
            case 'Draw_2':
                this.pendingDraw += 2;
                // Don't call nextTurn() here - let playCard handle it
                break;
            case 'Draw_4':
                this.pendingDraw += 4;
                // Don't call nextTurn() here - let playCard handle it
                break;
            case 'Wild':
                // Regular Wild card - just color change, no turn change
                break;
        }
        
        // Set current color for non-wild cards
        if (card.type !== 'wild') {
            this.currentColor = card.color;
        }
        
        // Show color modal for Wild cards - only to the player who played it
        if (card.type === 'wild' && playerIndex === 0) {
            this.showColorModal();
        } else if (card.type === 'wild' && playerIndex === 1) {
            // AI chooses color randomly
            const colors = ['Red', 'Blue', 'Green', 'Yellow'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.currentColor = randomColor;
        }
    }

    showColorModal() {
        document.getElementById('color-modal').style.display = 'block';
    }

    selectColor(color) {
        this.currentColor = color.charAt(0).toUpperCase() + color.slice(1); // Capitalize first letter
        document.getElementById('color-modal').style.display = 'none';
        
        // Update color indicator immediately
        this.updateColorIndicator();
        
        // Update display
        this.updateDisplay();
        this.updatePlayableCards();
        
        // AI turn (only if it's still the AI's turn after color selection)
        if (this.currentPlayer === 1 && this.gameState === 'playing') {
            setTimeout(() => {
                this.aiPlay();
            }, 1000);
        }
    }

    nextTurn() {
        // Move to next player
        this.currentPlayer = (this.currentPlayer + this.direction + this.players.length) % this.players.length;
        this.unoCalled = false;
        document.getElementById('uno-btn').disabled = true;
        
        // Update display and buttons
        this.updateDisplay();
        this.updatePlayableCards();
        this.updateDrawButtons();
    }
    
    drawPendingCards() {
        if (this.currentPlayer !== 0 || this.gameState !== 'playing' || this.pendingDraw === 0) {
            return;
        }
        
        // Draw the pending cards
        for (let i = 0; i < this.pendingDraw; i++) {
            if (this.deck.length === 0) {
                this.reshuffleDeck();
            }
            this.players[0].hand.push(this.deck.pop());
        }
        
        // Clear pending draws
        this.pendingDraw = 0;
        
        // Update display
        this.updateDisplay();
        this.updatePlayableCards();
        this.updateDrawButtons();
        
        // End turn after drawing
        this.nextTurn();
        
        // AI turn
        if (this.currentPlayer === 1 && this.gameState === 'playing') {
            setTimeout(() => {
                this.aiPlay();
            }, 1000);
        }
    }
    
    updateDrawButtons() {
        const drawCardBtn = document.getElementById('draw-card-btn');
        const drawPendingBtn = document.getElementById('draw-pending-btn');
        const pendingCountSpan = document.getElementById('pending-count');
        
        // Update pending count display
        pendingCountSpan.textContent = this.pendingDraw;
        
        if (this.currentPlayer === 0) {
            // Human player's turn
            if (this.pendingDraw > 0) {
                // Must draw pending cards first
                drawCardBtn.disabled = true;
                drawPendingBtn.disabled = false;
            } else {
                // Can draw regular card
                drawCardBtn.disabled = false;
                drawPendingBtn.disabled = true;
            }
        } else {
            // AI player's turn
            drawCardBtn.disabled = true;
            drawPendingBtn.disabled = true;
        }
    }

    drawCard() {
        if (this.currentPlayer !== 0 || this.gameState !== 'playing' || this.pendingDraw > 0) {
            return; // Can't draw regular card if there are pending draws
        }
        
        if (this.deck.length === 0) {
            this.reshuffleDeck();
        }
        
        const drawnCard = this.deck.pop();
        this.players[0].hand.push(drawnCard);
        
        // Always end turn after drawing (don't auto-play)
        this.nextTurn();
        this.updateDisplay();
        this.updatePlayableCards();
        this.updateDrawButtons();
        
        // AI turn
        if (this.currentPlayer === 1 && this.gameState === 'playing') {
            setTimeout(() => {
                this.aiPlay();
            }, 1000);
        }
    }

    aiPlay() {
        if (this.currentPlayer !== 1 || this.gameState !== 'playing') {
            return;
        }
        
        // If AI has pending draws, it must draw them
        if (this.pendingDraw > 0) {
            const aiHand = this.players[1].hand;
            const canPlayDrawCard = aiHand.some(card => 
                card.value === 'Draw_2' || card.value === 'Draw_4'
            );
            
            if (!canPlayDrawCard) {
                // AI must draw the pending cards
                for (let i = 0; i < this.pendingDraw; i++) {
                    if (this.deck.length === 0) {
                        this.reshuffleDeck();
                    }
                    aiHand.push(this.deck.pop());
                }
                this.pendingDraw = 0;
                this.updateDisplay();
                this.updatePlayableCards();
                this.updateDrawButtons();
                this.nextTurn();
                return;
            }
        }
        
        const topCard = this.discardPile[this.discardPile.length - 1];
        const aiHand = this.players[1].hand;
        
        // Find playable cards
        const playableCards = [];
        aiHand.forEach((card, index) => {
            if (this.canPlayCard(card, topCard)) {
                playableCards.push(index);
            }
        });
        
        if (playableCards.length > 0) {
            // Play a random playable card
            const randomIndex = playableCards[Math.floor(Math.random() * playableCards.length)];
            this.playCard(1, randomIndex);
        } else {
            // Draw a card and end turn
            if (this.deck.length === 0) {
                this.reshuffleDeck();
            }
            
            const drawnCard = this.deck.pop();
            aiHand.push(drawnCard);
            
            this.nextTurn();
            this.updateDisplay();
            this.updatePlayableCards();
            this.updateDrawButtons();
        }
    }

    callUno() {
        if (this.players[0].hand.length === 1 && !this.unoCalled) {
            this.unoCalled = true;
            document.getElementById('uno-btn').disabled = true;
            document.getElementById('game-status').textContent = 'UNO called!';
        }
    }

    reshuffleDeck() {
        // Keep the top card on discard pile
        const topCard = this.discardPile.pop();
        
        // Move remaining discard pile to deck
        this.deck = [...this.discardPile];
        this.discardPile = [topCard];
        
        // Shuffle the deck
        this.shuffleDeck();
    }

    endGame(winnerIndex) {
        this.gameState = 'gameOver';
        const winner = this.players[winnerIndex];
        
        document.getElementById('winner-text').textContent = `${winner.name} Wins!`;
        document.getElementById('game-over-message').textContent = 'Congratulations!';
        document.getElementById('game-over-modal').style.display = 'block';
        
        document.getElementById('game-status').textContent = 'Game Over!';
    }

    newGame() {
        // Reset game state
        this.players = [
            { name: 'Player 1', hand: [], isHuman: true },
            { name: 'Player 2', hand: [], isHuman: false }
        ];
        this.currentPlayer = 0;
        this.direction = 1;
        this.deck = [];
        this.discardPile = [];
        this.gameState = 'waiting';
        this.unoCalled = false;
        this.pendingDraw = 0;
        this.currentColor = null;
        this.canStack = false;
        
        // Hide modals
        document.getElementById('color-modal').style.display = 'none';
        document.getElementById('game-over-modal').style.display = 'none';
        
        // Reset UI
        document.getElementById('uno-btn').disabled = true;
        document.getElementById('end-turn-btn').disabled = true;
        document.getElementById('draw-pending-btn').disabled = true;
        document.getElementById('game-status').textContent = 'Game Started!';
        
        // Initialize new game
        this.initializeGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new UnoGame();
});

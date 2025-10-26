# UNO Game - 2 Players

A web-based implementation of the classic UNO card game for 2 players, featuring a beautiful modern UI and complete game mechanics.

## Features

- **Complete UNO Game Logic**: All standard UNO rules implemented
- **Beautiful Modern UI**: Gradient backgrounds, card animations, and responsive design
- **2-Player Mode**: Human vs AI gameplay
- **All Card Types**: Number cards, Skip, Reverse, Draw 2, Wild, and Wild Draw 4
- **Special Effects**: 
  - Skip cards skip the next player's turn
  - Reverse cards reverse play direction (acts as skip in 2-player mode)
  - Draw 2 forces next player to draw 2 cards
  - Wild cards allow color selection
  - Wild Draw 4 forces next player to draw 4 cards
- **UNO Call**: Players must call "UNO" when they have 1 card left
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Card Animations**: Smooth card dealing and playing animations

## How to Play

1. **Starting the Game**: Open `index.html` in your web browser
2. **Game Setup**: Each player starts with 7 cards
3. **Playing Cards**: Click on playable cards in your hand (highlighted with blue border)
4. **Card Matching**: Play cards that match the color, number, or type of the top card
5. **Special Cards**:
   - **Skip**: Skip the next player's turn
   - **Reverse**: Reverse play direction (skip in 2-player mode)
   - **Draw 2**: Next player draws 2 cards and skips their turn
   - **Wild**: Choose any color
   - **Wild Draw 4**: Choose any color, next player draws 4 cards and skips turn
6. **UNO**: Call "UNO" when you have 1 card left (click the UNO button)
7. **Winning**: First player to play all their cards wins!

## Game Controls

- **Draw Card**: Click to draw a card from the deck
- **UNO Button**: Click when you have 1 card left
- **New Game**: Start a fresh game
- **Color Selection**: Choose color when playing Wild cards

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # Game logic and AI
├── archive/            # Card images
│   ├── Red_*.jpg       # Red cards
│   ├── Blue_*.jpg      # Blue cards
│   ├── Green_*.jpg     # Green cards
│   ├── Yellow_*.jpg    # Yellow cards
│   ├── Wild.jpg        # Wild card
│   └── Wild_Draw_4.jpg # Wild Draw 4 card
└── README.md           # This file
```

## Technical Details

- **Pure JavaScript**: No external dependencies
- **ES6 Classes**: Modern JavaScript with class-based architecture
- **CSS Grid/Flexbox**: Responsive layout system
- **CSS Animations**: Smooth transitions and effects
- **AI Player**: Simple AI that plays randomly but follows all game rules

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

1. Ensure all files are in the same directory
2. Make sure the `archive` folder contains all card images
3. Open `index.html` in your web browser
4. Start playing!

## Game Rules

The game follows standard UNO rules:
- Match color, number, or type with the top card
- Special cards have unique effects
- Must call "UNO" when down to 1 card
- First to play all cards wins
- If deck runs out, reshuffle discard pile (except top card)

Enjoy playing UNO!
